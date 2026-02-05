<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\Owner;
use App\Models\Species;
use App\Models\Breed;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PetController extends Controller
{
    public function index()
    {
        return Inertia::render('Pets/Index', [
            'pets' => Pet::with(['owner', 'species', 'breed'])->get(),
            'owners' => Owner::select('id', 'first_name', 'last_name')->get(),
            'species' => Species::all(),
            'breeds' => Breed::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Pets/Create', [
            'owners' => Owner::select('id', 'first_name', 'last_name')->get(),
            'species' => Species::all(),
            'breeds' => Breed::all(),
        ]);
    }

    public function show(Pet $pet)
    {
        return Inertia::render('Pets/Show', [
            'pet' => $pet->load([
                'owner', 'species', 'breed', 'appointments.vet', 
                'medicalRecords.vet', 
                'medicalRecords.invoice.items',
                'medicalRecords.vaccinations', 
                'medicalRecords.medications.vet', 
                'medicalRecords.labResults.vet',
                'vaccinations', 'medications.vet', 'allergies', 'conditions', 'labResults.vet'
            ]),
            'species' => Species::all(),
            'breeds' => Breed::all(),
        ]);
    }

    public function store(Request $request)
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

        Pet::create($validated);

        return redirect()->back()->with('success', 'Pet registered successfully.');
    }

    public function edit(Pet $pet)
    {
        return Inertia::render('Pets/Edit', [
            'pet' => $pet->load(['owner', 'species', 'breed']),
            'owners' => Owner::select('id', 'first_name', 'last_name')->get(),
            'species' => Species::all(),
            'breeds' => Breed::all(),
        ]);
    }

    public function update(Request $request, Pet $pet)
    {
        $validated = $request->validate([
            'owner_id' => 'sometimes|exists:owners,id',
            'species_id' => 'sometimes|exists:species,id',
            'breed_id' => 'nullable|exists:breeds,id',
            'name' => 'sometimes|string|max:255',
            'dob' => 'nullable|date',
            'gender' => 'sometimes|in:Male,Female,Unknown',
            'color' => 'nullable|string',
        ]);

        // Fix to ensure optional fields are handled correctly
        if($request->has('breed_id') && $request->breed_id === "") {
             $validated['breed_id'] = null;
        }

        $pet->update($validated);

        return redirect()->route('pets.index')->with('success', 'Pet details updated.');
    }
    public function destroy(Pet $pet)
    {
        $pet->delete();
        return redirect()->back()->with('success', 'Pet removed from directory.');
    }
}
