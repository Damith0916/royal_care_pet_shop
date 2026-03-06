<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\MedicalRecord;
use App\Models\Owner;
use App\Models\Pet;
use App\Models\Product;
use App\Models\Species;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        // ── 1. SALES / REVENUE DATA ──
        $revenueData = Invoice::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_amount) as total')
        )
            ->where('status', 'Paid')
            ->whereBetween('created_at', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $totalRevenue = Invoice::where('status', 'Paid')
            ->whereBetween('created_at', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
            ->sum('total_amount');

        $totalInvoices = Invoice::where('status', 'Paid')
            ->whereBetween('created_at', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
            ->count();

        // ── 2. PET STATISTICS ──
        $totalPets = Pet::count();
        $totalOwners = Owner::count();

        // Pets by species with count
        $petsBySpecies = Species::withCount('pets')->orderBy('name')->get()
            ->map(fn ($s) => ['name' => $s->name, 'count' => $s->pets_count]);

        // Pets by gender
        $petsByGender = Pet::select('gender', DB::raw('COUNT(*) as count'))
            ->groupBy('gender')
            ->get();

        // Pets by age range
        $now = Carbon::now();
        $ageRanges = [
            '0-1 Year' => Pet::whereNotNull('dob')->where('dob', '>=', $now->copy()->subYear())->count(),
            '1-3 Years' => Pet::whereNotNull('dob')->where('dob', '<', $now->copy()->subYear())->where('dob', '>=', $now->copy()->subYears(3))->count(),
            '3-7 Years' => Pet::whereNotNull('dob')->where('dob', '<', $now->copy()->subYears(3))->where('dob', '>=', $now->copy()->subYears(7))->count(),
            '7+ Years' => Pet::whereNotNull('dob')->where('dob', '<', $now->copy()->subYears(7))->count(),
            'Unknown' => Pet::whereNull('dob')->count(),
        ];

        // Recent pet registrations in period
        $newPetsInPeriod = Pet::whereBetween('created_at', [$startDate.' 00:00:00', $endDate.' 23:59:59'])->count();

        // ── 3. DIAGNOSIS REPORT ──
        // Get all medical records in the period that have a diagnosis
        $diagnosisRecords = MedicalRecord::whereBetween('created_at', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
            ->whereNotNull('diagnosis')
            ->where('diagnosis', '!=', '')
            ->get();

        // Parse diagnosis strings (comma-separated) and count occurrences
        $diagnosisCounts = [];
        foreach ($diagnosisRecords as $record) {
            $diagnoses = array_map('trim', explode(',', $record->diagnosis));
            foreach ($diagnoses as $diag) {
                if (! empty($diag)) {
                    $key = ucfirst(strtolower($diag));
                    $diagnosisCounts[$key] = ($diagnosisCounts[$key] ?? 0) + 1;
                }
            }
        }
        arsort($diagnosisCounts);
        $topDiagnoses = collect($diagnosisCounts)->map(fn ($count, $name) => ['name' => $name, 'count' => $count])->values()->take(20);

        $totalDiagnosesInPeriod = $diagnosisRecords->count();
        $totalCases = MedicalRecord::whereBetween('created_at', [$startDate.' 00:00:00', $endDate.' 23:59:59'])->count();

        // ── 4. INVENTORY VALUE ──
        $inventoryValue = Product::sum(DB::raw('stock_quantity * unit_price'));

        return Inertia::render('Reports/Index', [
            'revenueData' => $revenueData,
            'totalRevenue' => $totalRevenue,
            'totalInvoices' => $totalInvoices,
            'totalPets' => $totalPets,
            'totalOwners' => $totalOwners,
            'petsBySpecies' => $petsBySpecies,
            'petsByGender' => $petsByGender,
            'ageRanges' => $ageRanges,
            'newPetsInPeriod' => $newPetsInPeriod,
            'topDiagnoses' => $topDiagnoses,
            'totalDiagnosesInPeriod' => $totalDiagnosesInPeriod,
            'totalCases' => $totalCases,
            'inventoryValue' => $inventoryValue,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function export(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        $filename = "report_{$startDate}_to_{$endDate}.csv";

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=$filename",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($startDate, $endDate) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Date', 'Description', 'Amount', 'Type']);

            Invoice::with('medicalRecord.pet')
                ->where('status', 'Paid')
                ->whereBetween('created_at', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
                ->chunk(100, function ($invoices) use ($file) {
                    foreach ($invoices as $invoice) {
                        fputcsv($file, [
                            $invoice->created_at->toDateString(),
                            "Invoice #{$invoice->id} - ".($invoice->medicalRecord->pet->name ?? 'Unknown Pet'),
                            $invoice->total_amount,
                            'Income',
                        ]);
                    }
                });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
