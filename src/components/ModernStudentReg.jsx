// @ts-nocheck
import React, { useState } from 'react';
import { User as UserIcon, ArrowRight } from 'lucide-react';

export default function ModernStudentReg({ onStart, onBack }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.length >= 3) {
            onStart(name);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            {/* Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 -z-10"></div>

            {/* Compact Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full border border-gray-200">
                {/* Icon Header */}
                <div className="w-14 h-14 bg-[#217346] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <UserIcon size={28} className="text-white" strokeWidth={2} />
                </div>

                <h2 className="text-xl font-bold mb-1 text-center text-gray-900">
                    Mulai Kuis
                </h2>
                <p className="text-gray-600 text-center mb-5 text-sm">
                    Masukkan nama lengkap Anda
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border-2 border-gray-300 rounded-lg transition-all bg-white focus:border-[#217346] focus:ring-2 focus:ring-green-100 text-sm"
                            autoFocus
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            {name.length}/50
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2">
                        <button
                            type="submit"
                            disabled={name.length < 3}
                            className={`w-full py-3 rounded-lg font-semibold transition-all flex justify-center items-center gap-2 text-sm ${name.length >= 3
                                    ? 'bg-[#217346] text-white shadow-md hover:bg-[#1a5c37] hover:shadow-lg'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <span>Mulai</span>
                            {name.length >= 3 && <ArrowRight size={16} strokeWidth={2} />}
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm"
                        >
                            Kembali
                        </button>
                    </div>
                </form>

                {/* Hint */}
                {name.length > 0 && name.length < 3 && (
                    <p className="text-xs text-orange-600 mt-3 text-center">
                        ⚠️ Minimal 3 karakter
                    </p>
                )}
            </div>
        </div>
    );
}
