import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, PawPrint } from 'lucide-react';

export default function EditPet({ pet, owners, species, breeds }) {
    const { data, setData, put, processing, errors } = useForm({
        name: pet.name || '',
        owner_id: pet.owner_id || '',
        species_id: pet.species_id || '',
        breed_id: pet.breed_id || '',
        dob: pet.dob || '',
        gender: pet.gender || 'Unknown',
        color: pet.color || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('pets.update', pet.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit ${pet.name}`} />

            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href={route('pets.index')} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 transition-colors">
                        <ArrowLeft size={18} />
                        Back to Directory
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <PawPrint size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Pet Profile</h1>
                            <p className="text-gray-500 font-medium">Update key information for {pet.name}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
                    <form onSubmit={submit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">Pet Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name}</p>}
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">Owner</label>
                                <select
                                    value={data.owner_id}
                                    onChange={e => setData('owner_id', e.target.value)}
                                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select Owner</option>
                                    {owners.map(owner => (
                                        <option key={owner.id} value={owner.id}>{owner.first_name} {owner.last_name}</option>
                                    ))}
                                </select>
                                {errors.owner_id && <p className="text-red-500 text-xs mt-1 font-bold">{errors.owner_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">Species</label>
                                <select
                                    value={data.species_id}
                                    onChange={e => setData('species_id', e.target.value)}
                                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select Species</option>
                                    {species.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">Breed</label>
                                <select
                                    value={data.breed_id}
                                    onChange={e => setData('breed_id', e.target.value)}
                                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select Breed (Optional)</option>
                                    {breeds.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">Gender</label>
                                <select
                                    value={data.gender}
                                    onChange={e => setData('gender', e.target.value)}
                                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Unknown">Unknown</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    value={data.dob}
                                    onChange={e => setData('dob', e.target.value)}
                                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">Color</label>
                                <input
                                    type="text"
                                    value={data.color}
                                    onChange={e => setData('color', e.target.value)}
                                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Golden"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-50">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
                            >
                                {processing ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
