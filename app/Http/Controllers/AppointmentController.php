<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Pet;
use App\Models\User;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $appointments = Appointment::with(['pet', 'owner', 'vet', 'services'])
            ->orderBy('datetime', 'asc')
            ->get();

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'pets' => Pet::select('id', 'name', 'owner_id')->with('owner:id,first_name,last_name')->get(),
            'vets' => User::whereHas('role', function($q) {
                $q->where('name', 'Veterinarian')->orWhere('name', 'Admin');
            })->select('id', 'first_name', 'last_name')->get(),
            'services' => Service::select('id', 'name', 'cost')->get(),
        ]);
    }

    public function show(Appointment $appointment)
    {
        return Inertia::render('Appointments/Show', [
            'appointment' => $appointment->load(['pet.species', 'pet.breed', 'owner', 'vet', 'services'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'vet_id' => 'required|exists:users,id',
            'datetime' => 'required|date',
            'status' => 'required|in:Pending,Confirmed,Completed,Canceled',
            'notes' => 'nullable|string',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        $pet = Pet::findOrFail($request->pet_id);
        
        $appointment = Appointment::create([
            'pet_id' => $validated['pet_id'],
            'owner_id' => $pet->owner_id,
            'vet_id' => $validated['vet_id'],
            'datetime' => $validated['datetime'],
            'status' => $validated['status'],
            'notes' => $validated['notes'],
        ]);

        if (!empty($validated['service_ids'])) {
            $services = Service::whereIn('id', $validated['service_ids'])->get();
            foreach ($services as $service) {
                $appointment->services()->attach($service->id, [
                    'clinic_id' => session('active_clinic_id'),
                    'service_cost_at_time' => $service->cost
                ]);
            }
        }

        return redirect()->back()->with('success', 'Appointment scheduled successfully.');
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'datetime' => 'sometimes|date',
            'status' => 'sometimes|in:Pending,Confirmed,Completed,Canceled',
            'notes' => 'nullable|string',
            'vet_id' => 'sometimes|exists:users,id',
        ]);

        $appointment->update($validated);

        return redirect()->back()->with('success', 'Appointment updated successfully.');
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return redirect()->back()->with('success', 'Appointment cancelled and removed.');
    }
}
