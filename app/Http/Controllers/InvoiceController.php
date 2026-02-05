<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Owner;
use App\Models\Appointment;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    public function index()
    {
        return Inertia::render('Billing/Index', [
            'invoices' => Invoice::with(['owner', 'appointment.pet', 'payments'])->orderBy('created_at', 'desc')->get(),
            'owners' => Owner::all(),
        ]);
    }

    public function show(Invoice $invoice)
    {
        return Inertia::render('Billing/Show', [
            'invoice' => $invoice->load(['owner', 'appointment.pet', 'items', 'payments']),
            'clinic' => \App\Models\Clinic::find($invoice->clinic_id)
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Invoices/Create', [
            'pets' => \App\Models\Pet::select('id', 'name', 'owner_id', 'species_id', 'breed_id')->with('owner:id,first_name,last_name,phone')->get(),
            'products' => \App\Models\Product::select('id', 'name', 'unit_price', 'stock_quantity')->where('stock_quantity', '>', 0)->get(),
            'services' => \App\Models\Service::select('id', 'name', 'cost')->get(),
            'appointments' => \App\Models\Appointment::select('id', 'pet_id', 'datetime', 'vet_id')
                ->with('vet:id,first_name,last_name')
                ->whereIn('status', ['Pending', 'Confirmed'])
                ->get(),
            'prefilled' => [
                'appointment_id' => $request->appointment_id,
                'pet_id' => $request->pet_id,
                'owner_id' => $request->owner_id,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'owner_id' => 'required|exists:owners,id',
            'pet_id' => 'nullable|exists:pets,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'reason_for_visit' => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.type' => 'required|in:Service,Product',
            'items.*.id' => 'required',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric',
            'service_charge' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string',
            'amount_paid' => 'nullable|numeric|min:0',
        ]);

        $subtotal = collect($validated['items'])->sum(function($item) {
            return $item['quantity'] * $item['unit_price'];
        });

        $serviceCharge = $validated['service_charge'] ?? 0;
        $discountAmount = $validated['discount_amount'] ?? 0;
        $totalAmount = max(0, $subtotal + $serviceCharge - $discountAmount);
        $taxAmount = 0;

        $invoice = Invoice::create([
            'clinic_id' => session('active_clinic_id') ?? 1,
            'owner_id' => $validated['owner_id'],
            'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
            'invoice_date' => $validated['invoice_date'],
            'status' => 'Pending',
            'total_amount' => $subtotal,
            'service_charge' => $serviceCharge,
            'discount_amount' => $discountAmount,
            'tax_amount' => $taxAmount,
            'net_amount' => $totalAmount,
            'appointment_id' => $validated['appointment_id'],
            'reason_for_visit' => $validated['reason_for_visit'],
        ]);

        // Create Medical Record for this Visit Context
        $medicalRecord = null;
        if (!empty($validated['pet_id'])) {
            $medicalRecord = \App\Models\MedicalRecord::create([
                'clinic_id' => $invoice->clinic_id,
                'pet_id' => $validated['pet_id'],
                'vet_id' => auth()->id(),
                'appointment_id' => $validated['appointment_id'],
                'invoice_id' => $invoice->id,
                'date_of_record' => now(),
                'reason_for_visit' => $validated['reason_for_visit'],
                'diagnosis' => 'Clinical Consultation', // Placeholder
                'status' => 'Resolved',
            ]);

            // Update Appointment Status if linked
            if ($validated['appointment_id']) {
                \App\Models\Appointment::find($validated['appointment_id'])->update([
                    'status' => 'Completed',
                    'reason_for_visit' => $validated['reason_for_visit']
                ]);
            }
        }

        foreach ($validated['items'] as $item) {
            $invoice->items()->create([
                'clinic_id' => $invoice->clinic_id,
                'item_type' => $item['type'],
                'item_id' => $item['id'],
                'item_name' => $item['name'],
                'quantity' => $item['quantity'],
                'unit_price_at_sale' => $item['unit_price'],
                'line_total' => $item['quantity'] * $item['unit_price'],
            ]);

            if ($item['type'] === 'Product' && !empty($validated['pet_id'])) {
                \App\Models\Medication::create([
                    'clinic_id' => $invoice->clinic_id,
                    'pet_id' => $validated['pet_id'],
                    'vet_id' => auth()->id(),
                    'drug_name' => $item['name'],
                    'dosage' => 'As prescribed',
                    'frequency' => 'Once',
                    'duration_days' => 1,
                    'date_prescribed' => now(),
                    'medical_record_id' => $medicalRecord?->id,
                ]);
                
                \App\Models\Product::find($item['id'])?->decrement('stock_quantity', $item['quantity']);
            }
        }

        // Process immediate payment if provided
        if (!empty($validated['amount_paid']) && $validated['amount_paid'] > 0) {
            Payment::create([
                'clinic_id' => $invoice->clinic_id,
                'invoice_id' => $invoice->id,
                'amount_paid' => $validated['amount_paid'],
                'payment_method' => $validated['payment_method'] ?? 'Cash',
                'payment_date' => now(),
                'received_by_user_id' => auth()->id(),
                'transaction_reference' => 'TXN-' . strtoupper(Str::random(10)),
            ]);

            if ($validated['amount_paid'] >= $totalAmount) {
                $invoice->update(['status' => 'Paid']);
            } else {
                $invoice->update(['status' => 'Partial']);
            }
        }

        return redirect()->route('billing.show', $invoice->id)->with('success', 'Invoice generated successfully.');
    }

    public function addPayment(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
        ]);

        Payment::create([
            'clinic_id' => $invoice->clinic_id,
            'invoice_id' => $invoice->id,
            'amount_paid' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'payment_date' => now(),
            'received_by_user_id' => auth()->id(),
            'transaction_reference' => 'TXN-' . strtoupper(Str::random(10)),
        ]);

        $totalPaid = $invoice->payments()->sum('amount_paid');
        if ($totalPaid >= $invoice->total_amount) {
            $invoice->update(['status' => 'Paid']);
        } elseif ($totalPaid > 0) {
            $invoice->update(['status' => 'Partial']);
        }

        return redirect()->back()->with('success', 'Payment recorded.');
    }
}
