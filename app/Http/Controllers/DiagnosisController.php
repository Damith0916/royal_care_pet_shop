<?php

namespace App\Http\Controllers;

use App\Models\Diagnosis;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiagnosisController extends Controller
{
    public function index()
    {
        return Inertia::render('Diagnoses/Index', [
            'diagnoses' => Diagnosis::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $diagnosis = Diagnosis::create($validated);

        if ($request->expectsJson()) {
            return response()->json($diagnosis);
        }

        return redirect()->back()->with('success', 'Diagnosis added to clinical library.');
    }

    public function update(Request $request, Diagnosis $diagnosis)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $diagnosis->update($validated);

        return redirect()->back()->with('success', 'Diagnosis updated successfully.');
    }

    public function destroy(Diagnosis $diagnosis)
    {
        $diagnosis->delete();

        return redirect()->back()->with('success', 'Diagnosis removed from clinical library.');
    }
}
