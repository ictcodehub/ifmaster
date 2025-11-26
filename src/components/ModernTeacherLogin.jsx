// @ts-nocheck
import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function ModernTeacherLogin({ onLogin, onBack }) {
    const [pin, setPin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(pin);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onLogin(pin);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {/* Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 -z-10"></div>

            {/* Modern Card */}
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-gray-200">
                {/* Icon Header */}
                <div className="w-20 h-20 bg-[#217346] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Lock size={36} className="text-white" strokeWidth={2} />
                </div>

                <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">
                    Login Guru
                </h2>
                <p className="text-gray-600 text-center mb-6 font-medium">
                    Masukkan PIN Admin
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* PIN Input */}
                    <div>
                        <input
                            type="password"
                            placeholder="PIN Admin"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full p-4 border-2 border-gray-300 rounded-xl transition-all duration-300 bg-white focus:border-[#217346] focus:shadow-lg text-center text-lg font-semibold tracking-widest"
                            autoFocus
                        />
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#217346] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#1a5c37] hover:shadow-xl transition-all flex justify-center items-center gap-2"
                        >
                            <span>Masuk</span>
                            <ArrowRight size={20} strokeWidth={2} />
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
