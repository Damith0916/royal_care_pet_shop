import React from 'react';
import PortalLayout from '../../Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';
import {
    PawPrint,
    ChevronRight,
    Calendar,
    Clock,
    AlertCircle,
    Activity,
    Syringe,
    ArrowUpRight
} from 'lucide-react';

export default function Home({ owner, clinic }) {
    return (
        <PortalLayout owner={owner} clinic={clinic}>
            <Head title="Owner Portal" />

            {/* Welcome Section */}
            <div className="mb-10 mt-4">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Hello, {owner.first_name}!</h1>
                <p className="text-gray-500 font-medium">Welcome to your pet's digital health board.</p>
            </div>

            {/* Pets Grid */}
            <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <PawPrint size={14} className="text-blue-600" />
                    Your Registered Pets
                </h3>

                {owner.pets.map(pet => (
                    <Link
                        key={pet.id}
                        href={`/portal/${owner.id}/pet/${pet.id}`}
                        className="block bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all active:scale-[0.98] group"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-[24px] bg-blue-50 text-blue-600 flex items-center justify-center ring-4 ring-blue-50/50 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <PawPrint size={40} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{pet.name}</h4>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <span className="bg-gray-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">{pet.species.name}</span>
                                    <span>•</span>
                                    <span>{pet.breed?.name || 'Mixed Breed'}</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>


            {/* Health Tips / Feed */}
            <div className="mt-12 space-y-6 pb-10">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Clinic Updates</h3>
                <div className="flex gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-1 leading-tight">Vaccination Drive</h5>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">Annual rabies vaccination drive starts next Monday. Visit us for 20% off.</p>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
