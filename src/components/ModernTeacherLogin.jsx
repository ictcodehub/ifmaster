// @ts-nocheck
import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function ModernTeacherLogin({ onLogin, onBack }) {
    const [pin, setPin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(pin);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            {/* Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 -z-10"></div>

            {/* Compact Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full border border-gray-200">
                {/* Icon Header */}
                <div className="w-14 h-14 bg-[#217346] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Lock size={28} className="text-white" strokeWidth={2} />
                </div>

                <h2 className="text-xl font-bold mb-1 text-center text-gray-900">
                    Login Guru
                </h2>
                <p className="text-gray-600 text-center mb-5 text-sm">
                    Masukkan PIN Admin
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* PIN Input */}
                    <input
                        type="password"
                        placeholder="PIN Admin"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onLogin(pin)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg transition-all bg-white focus:border-[#217346] focus:ring-2 focus:ring-green-100 text-center font-semibold tracking-wider text-sm"
                        autoFocus
                    />

                    {/* Buttons */}
                    <div className="space-y-2">
                        <button
                            type="submit"
                            className="w-full py-3 bg-[#217346] text-white rounded-lg font-semibold shadow-md hover:bg-[#1a5c37] hover:shadow-lg transition-all flex justify-center items-center gap-2 text-sm"
                        >
                            <span>Masuk</span>
                            <ArrowRight size={16} strokeWidth={2} />
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
