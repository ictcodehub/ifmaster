// @ts-nocheck
import React, { useState } from 'react';
import { User as UserIcon, ArrowRight } from 'lucide-react';

export default function ModernStudentReg({ onStart, onBack }) {
    const [name, setName] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.length >= 3) {
            onStart(name);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {/* Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 -z-10"></div>

            {/* Modern Card */}
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-200">
                {/* Icon Header */}
                <div className="w-20 h-20 bg-[#217346] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <UserIcon size={36} className="text-white" strokeWidth={2} />
                </div>

                <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">
                    Mulai Kuis
                </h2>
                <p className="text-gray-600 text-center mb-6 font-medium">
                    Masukkan nama lengkap Anda
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Modern Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className={`w-full p-4 border-2 rounded-xl transition-all duration-300 bg-white ${isFocused
                                    ? 'border-[#217346] shadow-lg'
                                    : 'border-gray-300'
                                }`}
                            autoFocus
                        />
                        {/* Character count */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                            {name.length}/50
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={name.length < 3}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${name.length >= 3
                                    ? 'bg-[#217346] text-white shadow-lg hover:bg-[#1a5c37] hover:shadow-xl'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <span>Mulai</span>
                            {name.length >= 3 && <ArrowRight size={20} strokeWidth={2} />}
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                        >
                            Kembali
                        </button>
                    </div>
                </form>

                {/* Hint */}
                {name.length > 0 && name.length < 3 && (
                    <p className="text-xs text-orange-600 mt-4 text-center font-medium">
                        ⚠️ Minimal 3 karakter
                    </p>
                )}
            </div>
        </div>
    );
}
