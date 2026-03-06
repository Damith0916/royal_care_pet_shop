<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'clinic' => Clinic::find(session('active_clinic_id')),
            'species' => \App\Models\Species::with('breeds')->get(),
            'roles' => \App\Models\Role::with('permissions')->get(),
        ]);
    }

    public function updateClinic(Request $request)
    {
        $clinic = Clinic::find(session('active_clinic_id'));

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'doctor_name' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'tax_rate' => 'nullable|numeric|min:0',
            'default_currency' => 'required|string|max:10',
        ]);

        $clinic->update($validated);

        return redirect()->back()->with('success', 'Clinic settings updated successfully.');
    }

    public function storeSpecies(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        \App\Models\Species::create($validated);

        return redirect()->back()->with('success', 'Species added.');
    }

    public function updateSpecies(Request $request, \App\Models\Species $species)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        $species->update($validated);

        return redirect()->back()->with('success', 'Species updated.');
    }

    public function destroySpecies(\App\Models\Species $species)
    {
        $species->delete();

        return redirect()->back()->with('success', 'Species deleted.');
    }

    public function storeBreed(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'species_id' => 'required|exists:species,id',
        ]);
        \App\Models\Breed::create($validated);

        return redirect()->back()->with('success', 'Breed added.');
    }

    public function destroyBreed(\App\Models\Breed $breed)
    {
        $breed->delete();

        return redirect()->back()->with('success', 'Breed deleted.');
    }

    public function storeRole(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255|unique:roles,name']);
        \App\Models\Role::create($validated);

        return redirect()->back()->with('success', 'Role created successfully.');
    }

    public function updateRole(Request $request, \App\Models\Role $role)
    {
        $validated = $request->validate(['name' => 'required|string|max:255|unique:roles,name,'.$role->id]);
        $role->update($validated);

        return redirect()->back()->with('success', 'Role updated successfully.');
    }

    public function destroyRole(\App\Models\Role $role)
    {
        // Prevent deleting critical roles like Admin or Vet if necessary, but for now simple delete
        if ($role->users()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete role assigned to users.');
        }
        $role->delete();

        return redirect()->back()->with('success', 'Role deleted successfully.');
    }
}
