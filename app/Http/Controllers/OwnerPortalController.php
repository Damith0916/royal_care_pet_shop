<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use App\Models\Pet;
use Inertia\Inertia;

class OwnerPortalController extends Controller
{
    /**
     * Access the portal using a unique ID (simulating QR code access)
     */
    public function index($uniqueId)
    {
        // For simplicity, we use the owner ID or a hashed version in production
        // Here we just find by ID for the demo
        $owner = Owner::with('pets.species', 'pets.breed')->findOrFail($uniqueId);

        return Inertia::render('OwnerPortal/Home', [
            'owner' => $owner,
            'clinic' => \App\Models\Clinic::find($owner->clinic_id),
        ]);
    }

    public function petProfile($uniqueId, Pet $pet)
    {
        $owner = Owner::findOrFail($uniqueId);

        if ($pet->owner_id !== $owner->id) {
            abort(403);
        }

        return Inertia::render('OwnerPortal/PetProfile', [
            'owner' => $owner,
            'pet' => $pet->load(['medicalRecords.vet', 'vaccinations', 'medications']),
            'clinic' => \App\Models\Clinic::find($owner->clinic_id),
        ]);
    }

    public function invoices($uniqueId)
    {
        $owner = Owner::with('invoices')->findOrFail($uniqueId);

        return Inertia::render('OwnerPortal/Invoices', [
            'owner' => $owner,
            'invoices' => $owner->invoices,
            'clinic' => \App\Models\Clinic::find($owner->clinic_id),
        ]);
    }
}
