// @ts-nocheck
import React, { useState } from 'react';
import { Lock, ArrowRight, Shield } from 'lucide-react';

export default function ModernTeacherLogin({ onLogin, onBack }) {
    const [pin, setPin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(pin);
    };

    return (
        <div className="flex items-center justify-center w-full">
            <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 -z-10"></div>

            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
                <div className="w-16 h-16 bg-[#217346] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Shield size={32} className="text-white" strokeWidth={2} />
                </div>

                <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">
                    Login Guru
                </h2>
                <p className="text-sm text-center text-gray-600 mb-6">
                    Akses khusus untuk pengelola kuis
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            PIN Admin
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="password"
                                placeholder="Masukkan PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onLogin(pin)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg transition-all focus:border-[#217346] focus:ring-2 focus:ring-green-100 outline-none text-center font-semibold tracking-widest text-sm"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-[#217346] text-white rounded-lg font-semibold shadow-md hover:bg-[#1a5c37] transition-all flex justify-center items-center gap-2 text-base"
                        >
                            <span>Masuk</span>
                            <ArrowRight size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors text-base"
                        >
                            Kembali
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
