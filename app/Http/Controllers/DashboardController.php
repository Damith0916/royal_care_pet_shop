<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pet;
use App\Models\Owner;
use App\Models\Appointment;
use App\Models\Payment;
use App\Models\Product;
use App\Models\MedicalRecord;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();
        $period = $request->input('period', 'monthly');
        
        $startDate = $period === 'weekly' ? Carbon::now()->startOfWeek() : Carbon::now()->startOfMonth();
        $endDate = $period === 'weekly' ? Carbon::now()->endOfWeek() : Carbon::now()->endOfMonth();

        $overview = [
            'period' => $period,
            'revenue' => Payment::whereBetween('payment_date', [$startDate, $endDate])->sum('amount_paid'),
            'appointments' => Appointment::whereBetween('datetime', [$startDate, $endDate])->count(),
            'new_pets' => Pet::whereBetween('created_at', [$startDate, $endDate])->count(),
            'new_owners' => Owner::whereBetween('created_at', [$startDate, $endDate])->count(),
        ];

        $stats = [
            'totalPets' => Pet::count(),
            'totalOwners' => Owner::count(),
            'upcomingAppointments' => Appointment::where('status', 'Pending')
                ->whereDate('datetime', '>=', $today)
                ->count(),
            'revenueToday' => Payment::whereDate('payment_date', $today)->sum('amount_paid'),
            'lowStockAlerts' => Product::whereColumn('stock_quantity', '<=', 'min_stock_level')->count(),
        ];

        $recentActivities = collect();

        $recentRecords = MedicalRecord::with(['pet', 'vet'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($record) {
                return [
                    'id' => 'hr_' . $record->id,
                    'type' => 'Health Record',
                    'title' => 'Medical Checkup',
                    'description' => "{$record->pet->name} checked by Dr. {$record->vet->last_name}.",
                    'time' => $record->created_at->diffForHumans(),
                    'timestamp' => $record->created_at,
                    'icon' => 'Activity',
                    'color' => 'blue'
                ];
            });

        $recentInvoices = \App\Models\Invoice::with(['owner'])
            ->where('status', 'Paid')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($invoice) {
                return [
                    'id' => 'inv_' . $invoice->id,
                    'type' => 'Payment',
                    'title' => 'Invoice Paid',
                    'description' => "Received LKR " . number_format($invoice->total_amount, 2) . " from {$invoice->owner->last_name}.",
                    'time' => $invoice->updated_at->diffForHumans(),
                    'timestamp' => $invoice->updated_at,
                    'icon' => 'DollarSign',
                    'color' => 'green'
                ];
            });

        $recentActivities = $recentActivities->concat($recentRecords)->concat($recentInvoices)
            ->sortByDesc('timestamp')
            ->take(5)
            ->values();

        $revenueChart = Payment::selectRaw('DATE(payment_date) as date, SUM(amount_paid) as total')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Dashboard/Index', [
            'overview' => $overview,
            'revenueChart' => $revenueChart,
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'upcomingSchedule' => Appointment::with(['pet', 'vet'])
                ->where('status', 'Pending')
                ->whereDate('datetime', '>=', $today)
                ->orderBy('datetime', 'asc')
                ->limit(5)
                ->get()
        ]);
    }
}
