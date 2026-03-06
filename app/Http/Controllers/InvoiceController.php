<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Owner;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        return Inertia::render('Billing/Index', [
            'invoices' => Invoice::has('medicalRecord')
                ->whereNull('closed_at')
                ->with(['owner', 'medicalRecord.pet', 'payments', 'items'])
                ->orderBy('created_at', 'desc')
                ->get(),
            'owners' => Owner::all(),
        ]);
    }

    public function show(Invoice $invoice)
    {
        return Inertia::render('Billing/Show', [
            'invoice' => $invoice->load(['owner', 'medicalRecord.pet', 'items', 'payments']),
            'clinic' => \App\Models\Clinic::find($invoice->clinic_id),
        ]);
    }

    public function create(Request $request)
    {
        abort(404);
    }

    public function store(Request $request)
    {
        abort(404);
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
            'transaction_reference' => 'TXN-'.strtoupper(Str::random(10)),
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
