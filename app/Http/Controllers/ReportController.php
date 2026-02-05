<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Appointment;
use App\Models\Pet;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        $revenueData = Invoice::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_amount) as total')
        )
        ->where('status', 'Paid')
        ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
        ->groupBy('date')
        ->get();

        $appointmentStats = Appointment::select('status', DB::raw('count(*) as count'))
            ->whereBetween('datetime', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->groupBy('status')
            ->get();

        $speciesDistribution = Pet::with('species')
            ->get()
            ->groupBy('species.name')
            ->map(fn($group) => $group->count());

        $inventoryValue = Product::sum(DB::raw('stock_quantity * unit_price'));

        return Inertia::render('Reports/Index', [
            'revenueData' => $revenueData,
            'appointmentStats' => $appointmentStats,
            'speciesDistribution' => $speciesDistribution,
            'inventoryValue' => $inventoryValue,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }

    public function export(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        $filename = "report_{$startDate}_to_{$endDate}.csv";
        
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = ['Date', 'Title', 'Amount', 'Type'];

        $callback = function() use ($startDate, $endDate) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Date', 'Description', 'Amount', 'Type']);

            // Revenue
            Invoice::where('status', 'Paid')
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->chunk(100, function($invoices) use ($file) {
                    foreach ($invoices as $invoice) {
                        fputcsv($file, [
                            $invoice->created_at->toDateString(),
                            "Invoice #{$invoice->id} - " . ($invoice->pet->name ?? 'Unknown Pet'),
                            $invoice->total_amount,
                            'Income'
                        ]);
                    }
                });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
