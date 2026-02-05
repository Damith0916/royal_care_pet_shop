<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OwnerController extends Controller
{
    public function index()
    {
        return Inertia::render('Owners/Index', [
            'owners' => Owner::withCount('pets')->get()
        ]);
    }

    public function show(Owner $owner)
    {
        return Inertia::render('Owners/Show', [
            'owner' => $owner->load(['pets.species', 'pets.breed', 'appointments.pet', 'invoices'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:owners,email',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
        ]);

        $validated['unique_owner_code'] = 'OWN-' . strtoupper(substr(uniqid(), -6));
        $validated['portal_access_enabled'] = true;

        Owner::create($validated);

        return redirect()->back()->with('success', 'Pet owner registered successfully.');
    }

    public function update(Request $request, Owner $owner)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:owners,email,' . $owner->id,
            'phone' => 'sometimes|string|max:20',
            'address' => 'nullable|string',
        ]);

        $owner->update($validated);

        return redirect()->back()->with('success', 'Owner details updated.');
    }

    public function destroy(Owner $owner)
    {
        $owner->delete();
        return redirect()->back()->with('success', 'Owner and their pet records removed.');
    }
}
