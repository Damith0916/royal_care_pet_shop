<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Clinic;

class ClinicMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // For admin/staff, we can detect clinic from the authenticated user
        if ($request->user() && $request->user()->clinic_id) {
            $clinic = $request->user()->clinic;
            
            // Share clinic data globally for Inertia/Views if needed
            session(['active_clinic_id' => $clinic->id]);
            config(['app.active_clinic' => $clinic]);
        }

        return $next($request);
    }
}
