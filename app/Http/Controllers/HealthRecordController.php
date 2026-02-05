<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Pet;
use App\Models\Vaccination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HealthRecordController extends Controller
{
    public function store(Request $request, Pet $pet)
    {
        $validated = $request->validate([
            'type' => 'required|in:Consultation,Vaccination,LabResult,Condition,Allergy',
            // Consultation fields
            'diagnosis' => 'required_if:type,Consultation|nullable|string|max:255',
            'treatment_plan' => 'nullable|string',
            'weight' => 'nullable|numeric',
            'temperature' => 'nullable|numeric',
            'notes' => 'nullable|string',
            // Vaccination fields
            'vaccine_name' => 'required_if:type,Vaccination|nullable|string|max:255',
            'vaccination_date' => 'required_if:type,Vaccination|nullable|date',
            'next_due_date' => 'nullable|date',
            // Lab Result fields
            'test_type' => 'required_if:type,LabResult|nullable|string|max:255',
            'date_requested' => 'nullable|date',
            'date_resulted' => 'nullable|date',
            'result_summary' => 'nullable|string',
            // Condition fields
            'condition_name' => 'required_if:type,Condition|nullable|string|max:255',
            'is_chronic' => 'nullable|boolean',
            // Allergy fields
            'allergy_name' => 'required_if:type,Allergy|nullable|string|max:255',
            'severity' => 'nullable|in:Low,Medium,High',
        ]);

        $clinicId = session('active_clinic_id');

        if ($validated['type'] === 'Consultation') {
            MedicalRecord::create([
                'clinic_id' => $clinicId,
                'pet_id' => $pet->id,
                'vet_id' => Auth::id(),
                'date_of_record' => now(),
                'diagnosis' => $validated['diagnosis'],
                'treatment_plan' => $validated['treatment_plan'],
                'weight_kg' => $validated['weight'],
                'temperature_c' => $validated['temperature'],
                'observations' => $validated['notes'] ?? null,
            ]);
        } elseif ($validated['type'] === 'Vaccination') {
            \App\Models\Vaccination::create([
                'clinic_id' => $clinicId,
                'pet_id' => $pet->id,
                'vaccine_type' => $validated['vaccine_name'],
                'date_given' => $validated['vaccination_date'] ?? now(),
                'next_due_date' => $validated['next_due_date'],
                'administered_by_vet_id' => Auth::id(),
            ]);
        } elseif ($validated['type'] === 'LabResult') {
            \App\Models\LabResult::create([
                'clinic_id' => $clinicId,
                'pet_id' => $pet->id,
                'vet_id' => Auth::id(),
                'test_type' => $validated['test_type'],
                'date_requested' => $validated['date_requested'] ?? now(),
                'date_resulted' => $validated['date_resulted'],
                'result_summary' => $validated['result_summary'],
            ]);
        } elseif ($validated['type'] === 'Condition') {
            \App\Models\Condition::create([
                'clinic_id' => $clinicId,
                'pet_id' => $pet->id,
                'condition_name' => $validated['condition_name'],
                'diagnosis_date' => now(),
                'is_chronic' => $validated['is_chronic'] ?? false,
                'status' => 'Ongoing',
            ]);
        } elseif ($validated['type'] === 'Allergy') {
            \App\Models\Allergy::create([
                'clinic_id' => $clinicId,
                'pet_id' => $pet->id,
                'allergy_name' => $validated['allergy_name'],
                'severity' => $validated['severity'] ?? 'Medium',
                'notes' => $validated['notes'] ?? null,
            ]);
        }

        return redirect()->back()->with('success', 'Medical record added successfully.');
    }
}
