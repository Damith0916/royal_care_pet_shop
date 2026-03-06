<?php

namespace App\Http\Controllers;

use App\Models\Diagnosis;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\MedicalRecord;
use App\Models\Owner;
use App\Models\Payment;
use App\Models\Pet;
use App\Models\Product;
use App\Models\Species;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class NewCaseController extends Controller
{
    public function index()
    {
        return Inertia::render('NewCase/Index', [
            'initialDiagnoses' => Diagnosis::orderBy('name')->get(),
            'products' => Product::with('category')->get(),
            'clinic' => \App\Models\Clinic::find(session('active_clinic_id')),
        ]);
    }

    public function getOwners(Request $request)
    {
        $search = $request->input('search');

        return Owner::where(function ($query) use ($search) {
            $query->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
        })
            ->limit(10)
            ->get();
    }

    public function getPets(Owner $owner)
    {
        return $owner->pets()->with(['species', 'breed'])->get();
    }

    public function getHistory(Pet $pet)
    {
        return MedicalRecord::where('pet_id', $pet->id)
            ->with(['medications', 'vaccinations'])
            ->orderBy('date_of_record', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'complane' => 'nullable|array',
            'patient_history' => 'nullable|array',
            'clinical_signs' => 'nullable|array',
            'lab_findings' => 'nullable|array',
            'differential_diagnosis' => 'nullable|array',
            'diagnosis' => 'nullable|string',
            'treatment_plan' => 'nullable|string',
            'observations' => 'nullable|string',
            'weight_kg' => 'nullable|numeric',
            'items' => 'nullable|array',
            'prescribed_drugs' => 'nullable|array',
            'rx_note' => 'nullable|string',
            'service_charge' => 'nullable|numeric',
            'record_id' => 'nullable|integer',
            'invoice_id' => 'nullable|integer',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $pet = Pet::findOrFail($validated['pet_id']);

            // 1. Prepare Invoice (Update or Create)
            if ($request->filled('invoice_id')) {
                $invoice = Invoice::findOrFail($request->input('invoice_id'));
                // Revert stock before clearing items
                foreach ($invoice->items as $oldItem) {
                    if ($oldItem->item_type === 'Product' && $oldItem->item_id) {
                        Product::where('id', $oldItem->item_id)->increment('stock_quantity', $oldItem->quantity);
                    }
                }
                $invoice->items()->delete();
                $invoice->payments()->delete();
                
                $invoice->update([
                    'service_charge' => $validated['service_charge'] ?? 0,
                    'invoice_date' => now(),
                    'total_amount' => 0,
                    'net_amount' => 0,
                ]);
            } else {
                $invoice = Invoice::create([
                    'clinic_id' => auth()->user()->clinic_id,
                    'owner_id' => $pet->owner_id,
                    'invoice_number' => 'INV-'.strtoupper(uniqid()),
                    'invoice_date' => now(),
                    'total_amount' => 0,
                    'tax_amount' => 0,
                    'discount_amount' => 0,
                    'net_amount' => 0,
                    'status' => 'Pending',
                    'service_charge' => $validated['service_charge'] ?? 0,
                ]);
            }

            $total = 0;
            foreach ($validated['items'] ?? [] as $item) {
                $product = Product::find($item['product_id']);
                if ($product) {
                    InvoiceItem::create([
                        'clinic_id' => auth()->user()->clinic_id,
                        'invoice_id' => $invoice->id,
                        'item_type' => 'Product',
                        'item_id' => $product->id,
                        'item_name' => $product->name,
                        'quantity' => $item['quantity'],
                        'unit_price_at_sale' => $item['price'],
                        'line_total' => $item['quantity'] * $item['price'],
                    ]);
                    $total += $item['quantity'] * $item['price'];
                    $product->decrement('stock_quantity', $item['quantity']);
                }
            }

            foreach ($validated['prescribed_drugs'] ?? [] as $drug) {
                if (isset($drug['product_id'])) {
                    $product = Product::find($drug['product_id']);
                    if ($product) {
                        InvoiceItem::create([
                            'clinic_id' => auth()->user()->clinic_id,
                            'invoice_id' => $invoice->id,
                            'item_type' => 'Product',
                            'item_id' => $product->id,
                            'item_name' => $product->name,
                            'quantity' => is_numeric($drug['quantity']) ? (float)$drug['quantity'] : 1,
                            'unit_price_at_sale' => $drug['price'] ?? 0,
                            'line_total' => (float)(is_numeric($drug['quantity']) ? $drug['quantity'] : 1) * (float)($drug['price'] ?? 0),
                        ]);
                        $total += (float)(is_numeric($drug['quantity']) ? $drug['quantity'] : 1) * (float)($drug['price'] ?? 0);
                        // Optional: Deduct stock for prescriptions if quantity is numeric
                        if (is_numeric($drug['quantity'])) {
                            $product->decrement('stock_quantity', (float)$drug['quantity']);
                        }
                    }
                }
            }

            $serviceCharge = $validated['service_charge'] ?? 0;
            $finalTotal = $total + $serviceCharge;
            $invoice->update(['total_amount' => $finalTotal, 'net_amount' => $finalTotal]);

            // 2. Prepare Medical Record (Update or Create)
            if ($request->filled('record_id')) {
                $record = MedicalRecord::findOrFail($request->input('record_id'));
                $record->medications()->delete();
                $record->vaccinations()->delete();
                
                $record->update([
                    'complane' => $validated['complane'],
                    'patient_history' => $validated['patient_history'],
                    'clinical_signs' => $validated['clinical_signs'],
                    'lab_findings' => $validated['lab_findings'],
                    'differential_diagnosis' => $validated['differential_diagnosis'],
                    'diagnosis' => $validated['diagnosis'],
                    'treatment_plan' => $validated['treatment_plan'],
                    'observations' => $validated['observations'] ?? null,
                    'rx_note' => $validated['rx_note'] ?? null,
                    'weight_kg' => $validated['weight_kg'] ?? 0,
                ]);
            } else {
                $record = MedicalRecord::create([
                    'clinic_id' => auth()->user()->clinic_id,
                    'pet_id' => $pet->id,
                    'vet_id' => auth()->id(),
                    'invoice_id' => $invoice->id,
                    'date_of_record' => now(),
                    'complane' => $validated['complane'],
                    'patient_history' => $validated['patient_history'],
                    'clinical_signs' => $validated['clinical_signs'],
                    'lab_findings' => $validated['lab_findings'],
                    'differential_diagnosis' => $validated['differential_diagnosis'],
                    'diagnosis' => $validated['diagnosis'],
                    'treatment_plan' => $validated['treatment_plan'],
                    'observations' => $validated['observations'] ?? null,
                    'rx_note' => $validated['rx_note'] ?? null,
                    'weight_kg' => $validated['weight_kg'] ?? 0,
                    'status' => 'Resolved',
                ]);
            }

            // 3. Create Vaccinations/Medications
            foreach ($validated['items'] ?? [] as $item) {
                $type = strtolower($item['type'] ?? '');
                if ($type === 'vaccine') {
                    \App\Models\Vaccination::create([
                        'clinic_id' => auth()->user()->clinic_id, 'pet_id' => $pet->id, 'vaccine_type' => $item['name'], 'date_given' => now(), 'administered_by_vet_id' => auth()->id(), 'medical_record_id' => $record->id,
                    ]);
                } else {
                    \App\Models\Medication::create([
                        'clinic_id' => auth()->user()->clinic_id, 'pet_id' => $pet->id, 'vet_id' => auth()->id(), 'date_prescribed' => now(), 'drug_name' => $item['name'], 'dosage' => 'Administered ('.$item['quantity'].' Units)', 'frequency' => 'Once', 'duration_days' => 1, 'medical_record_id' => $record->id,
                    ]);
                }
            }

            foreach ($validated['prescribed_drugs'] ?? [] as $drug) {
                \App\Models\Medication::create([
                    'clinic_id' => auth()->user()->clinic_id, 'pet_id' => $pet->id, 'vet_id' => auth()->id(), 'date_prescribed' => now(), 'drug_name' => $drug['name'], 'dosage' => $drug['quantity'] ?? 'N/A', 'frequency' => $drug['frequency'] ?? 'N/A', 'duration_days' => (int) filter_var($drug['duration'] ?? '1', FILTER_SANITIZE_NUMBER_INT), 'medical_record_id' => $record->id,
                ]);
            }

            // 4. Complete Payment
            Payment::create([
                'clinic_id' => auth()->user()->clinic_id, 'invoice_id' => $invoice->id, 'amount_paid' => $finalTotal, 'payment_method' => 'Cash', 'payment_date' => now(), 'received_by_user_id' => auth()->id(),
            ]);

            $invoice->update(['status' => 'Paid']);

            $lowStockAlerts = [];
            foreach ($validated['items'] ?? [] as $item) {
                $product = Product::find($item['product_id']);
                if ($product && $product->stock_quantity <= $product->min_stock_level) {
                    $lowStockAlerts[] = [
                        'name' => $product->name,
                        'current_stock' => $product->stock_quantity,
                        'min_stock' => $product->min_stock_level,
                    ];
                }
            }

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true, 
                    'record_id' => $record->id, 
                    'invoice_id' => $invoice->id, 
                    'message' => 'Case saved successfully!',
                    'low_stock_alerts' => $lowStockAlerts
                ]);
            }
            return redirect()->route('billing.index')->with('success', 'Case saved successfully!');
        });
    }

    public function storeOwner(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
        ]);

        $owner = Owner::create(array_merge($validated, [
            'clinic_id' => auth()->user()->clinic_id,
        ]));

        return response()->json($owner);
    }

    public function storePet(Request $request)
    {
        $validated = $request->validate([
            'owner_id' => 'required|exists:owners,id',
            'species_id' => 'required|exists:species,id',
            'breed_id' => 'nullable|exists:breeds,id',
            'name' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'gender' => 'required|in:Male,Female,Unknown',
            'color' => 'nullable|string',
        ]);

        $pet = Pet::create(array_merge($validated, [
            'clinic_id' => auth()->user()->clinic_id,
            'is_active' => true,
        ]));

        return response()->json($pet->load(['species', 'breed']));
    }

    public function updateRemarks(Request $request, Pet $pet)
    {
        $validated = $request->validate([
            'remark' => 'required|string',
        ]);

        $currentRemarks = $pet->special_characteristics ? explode("\n", $pet->special_characteristics) : [];
        $currentRemarks[] = $validated['remark'];

        $pet->update([
            'special_characteristics' => implode("\n", array_filter($currentRemarks)),
        ]);

        return response()->json([
            'success' => true,
            'special_characteristics' => $pet->special_characteristics,
        ]);
    }

    public function editRemark(Request $request, Pet $pet)
    {
        $validated = $request->validate([
            'index' => 'required|integer',
            'remark' => 'required|string',
        ]);

        $currentRemarks = $pet->special_characteristics ? explode("\n", $pet->special_characteristics) : [];
        if (isset($currentRemarks[$validated['index']])) {
            $currentRemarks[$validated['index']] = $validated['remark'];
        }

        $pet->update([
            'special_characteristics' => implode("\n", array_filter($currentRemarks)),
        ]);

        return response()->json([
            'success' => true,
            'special_characteristics' => $pet->special_characteristics,
        ]);
    }

    public function deleteRemark(Request $request, Pet $pet)
    {
        $validated = $request->validate([
            'index' => 'required|integer',
        ]);

        $currentRemarks = $pet->special_characteristics ? explode("\n", $pet->special_characteristics) : [];
        if (isset($currentRemarks[$validated['index']])) {
            unset($currentRemarks[$validated['index']]);
        }

        $pet->update([
            'special_characteristics' => implode("\n", array_filter($currentRemarks)),
        ]);

        return response()->json([
            'success' => true,
            'special_characteristics' => $pet->special_characteristics,
        ]);
    }

    public function getSpecies()
    {
        return response()->json(Species::orderBy('name')->get());
    }

    public function getBreeds(Species $species)
    {
        return response()->json($species->breeds()->orderBy('name')->get());
    }

    public function printPrescription(MedicalRecord $record)
    {
        $record->load(['pet.owner', 'pet.species', 'pet.breed', 'medications', 'vet', 'clinic']);
        return Inertia::render('NewCase/PrintPrescription', [
            'record' => $record,
            'clinic' => $record->clinic,
        ]);
    }

    public function printBill(Invoice $invoice)
    {
        $invoice->load(['owner', 'clinic', 'items.product.category', 'payments', 'medicalRecord.pet']);
        return Inertia::render('NewCase/PrintBill', [
            'invoice' => $invoice,
            'clinic' => $invoice->clinic,
        ]);
    }

    public function previewPrescription(Request $request)
    {
        $prescribed = is_string($request->prescribed_drugs) ? json_decode($request->prescribed_drugs, true) : ($request->prescribed_drugs ?? []);
        $pet = Pet::with(['owner', 'species', 'breed'])->find($request->pet_id);
        if (!$pet) {
            return redirect()->back()->with('error', 'Pet not selected for preview.');
        }
        
        $record = (object)[
            'pet' => $pet,
            'medications' => collect($prescribed)->map(fn($d) => (object)[
                'drug_name' => $d['name'],
                'dosage' => $d['quantity'],
                'frequency' => $d['frequency'],
                'duration_days' => $d['duration'],
            ]),
            'rx_note' => $request->rx_note,
            'date_of_record' => now(),
        ];
        return Inertia::render('NewCase/PrintPrescription', [
            'record' => $record,
            'clinic' => auth()->user()->clinic,
        ]);
    }

    public function previewBill(Request $request)
    {
        $pet = Pet::find($request->pet_id);
        if (!$pet) {
            return redirect()->back()->with('error', 'Pet not selected for bill preview.');
        }
        $itemsRaw = is_string($request->items) ? json_decode($request->items, true) : ($request->items ?? []);
        $prescribedRaw = is_string($request->prescribed_drugs) ? json_decode($request->prescribed_drugs, true) : ($request->prescribed_drugs ?? []);

        $items = collect($itemsRaw)->map(fn($item) => (object)[
            'item_name' => $item['name'] ?? 'N/A',
            'quantity' => $item['quantity'] ?? 1,
            'line_total' => (float)($item['quantity'] ?? 1) * (float)($item['price'] ?? 0),
            'product' => (object)['category' => (object)['name' => ucfirst($item['category'] ?? $item['type'] ?? 'Product')]]
        ]);

        $prescribed = collect($prescribedRaw)->map(fn($drug) => (object)[
            'item_name' => $drug['name'] ?? 'N/A',
            'quantity' => $drug['quantity'] ?? 'N/A',
            'line_total' => (float)(is_numeric($drug['quantity']) ? $drug['quantity'] : 1) * (float)($drug['price'] ?? 0),
            'product' => (object)['category' => (object)['name' => 'Prescription']]
        ]);

        $invoice = (object)[
            'invoice_number' => 'DRAFT',
            'invoice_date' => now(),
            'net_amount' => $request->total_amount ?? 0,
            'discount_amount' => $request->discount ?? 0,
            'service_charge' => $request->service_charge ?? 0,
            'items' => $items->concat($prescribed),
            'medical_record' => (object)['rx_note' => $request->rx_note]
        ];

        return Inertia::render('NewCase/PrintBill', [
            'invoice' => $invoice,
            'clinic' => auth()->user()->clinic,
        ]);
    }
}
