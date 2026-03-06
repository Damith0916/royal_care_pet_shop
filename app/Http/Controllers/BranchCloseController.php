<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\MedicalRecord;
use App\Models\Owner;
use App\Models\Pet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchCloseController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        
        // Data for the current open session
        $openInvoices = Invoice::whereNull('closed_at')
            ->with(['owner', 'medicalRecord.pet', 'payments'])
            ->get();

        $openInvoicesCount = $openInvoices->count();
        $totalRevenue = Payment::whereHas('invoice', function($query) {
            $query->whereNull('closed_at');
        })->sum('amount_paid');

        // New registrations and records for today (since we usually close at end of day)
        $newCasesCount = MedicalRecord::whereDate('created_at', $today)->count();
        $newOwnersCount = Owner::whereDate('created_at', $today)->count();
        $newPetsCount = Pet::whereDate('created_at', $today)->count();

        return Inertia::render('Dashboard/BranchClose', [
            'summary' => [
                'open_invoices_count' => $openInvoicesCount,
                'revenue' => $totalRevenue,
                'new_cases_count' => $newCasesCount,
                'new_owners_count' => $newOwnersCount,
                'new_pets_count' => $newPetsCount,
                'date' => $today->format('Y-m-d'),
                'invoices' => $openInvoices->map(fn($inv) => [
                    'id' => $inv->id,
                    'number' => $inv->invoice_number,
                    'owner' => $inv->owner->first_name . ' ' . $inv->owner->last_name,
                    'pet' => $inv->medicalRecord->pet->name ?? 'N/A',
                    'total' => $inv->net_amount,
                    'paid' => $inv->payments->sum('amount_paid'),
                    'status' => $inv->status
                ])
            ]
        ]);
    }

    public function store(Request $request)
    {
        // Close all unclosed invoices for the current clinic context
        Invoice::whereNull('closed_at')->update([
            'closed_at' => now()
        ]);

        // Logout the user as requested
        auth()->guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Branch closed successfully. All sessions have been finalized.');
    }
}
