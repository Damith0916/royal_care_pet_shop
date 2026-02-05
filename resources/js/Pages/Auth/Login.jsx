import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] font-sans">
            <Head title="Login" />

            <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-sm border border-gray-100 p-10 py-12">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="mb-6 flex flex-col items-center">
                        <img
                            src="/storage/smartpetcarelogo.png"
                            alt="Smart Pet Care Logo"
                            className="h-20 w-auto object-contain mb-4"
                        />
                        <div className="h-1 w-12 bg-blue-600 rounded-full mb-4"></div>
                        <h1 className="text-xl font-black text-gray-900 uppercase tracking-[0.2em] leading-none">Smart Pet Care</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 px-6 border-x border-gray-100 italic">Advanced Clinical Intelligence Node</p>
                    </div>
                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mt-4">Authorized Access Only</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                placeholder="name@clinic.com"
                                required
                            />
                        </div>
                        {errors.email && <p className="mt-2 text-xs text-red-500 font-medium">{errors.email}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {errors.password && <p className="mt-2 text-xs text-red-500 font-medium">{errors.password}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            id="remember"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-600 cursor-pointer select-none">Remember for 30 days</label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        {processing ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Powered by <span className="text-gray-900 font-bold italic tracking-tight underline dec-blue-500">Antigravity</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
