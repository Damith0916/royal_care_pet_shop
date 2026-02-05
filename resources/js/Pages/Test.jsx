import React from 'react';
import Dashboard from './Dashboard/Index';

export default function Test() {
    return (
        <Dashboard stats={{
            totalPets: 0,
            totalOwners: 0,
            upcomingAppointments: 0,
            revenueToday: 0
        }} />
    );
}
