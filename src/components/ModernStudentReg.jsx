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
        <div className="flex items-center justify-center w-full">
            <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 -z-10"></div>

            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
                <div className="w-16 h-16 bg-[#217346] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <UserIcon size={32} className="text-white" strokeWidth={2} />
                </div>

                <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">
                    Registrasi Siswa
                </h2>
                <p className="text-sm text-center text-gray-600 mb-6">
                    Masukkan nama lengkap untuk memulai
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Nama Lengkap
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Contoh: Ahmad Fauzi"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg transition-all focus:border-[#217346] focus:ring-2 focus:ring-green-100 outline-none text-base"
                                autoFocus
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                {name.length}/50
                            </span>
                        </div>
                        {name.length > 0 && name.length < 3 && (
                            <p className="text-sm text-orange-600 mt-2">Minimal 3 karakter</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={name.length < 3}
                            className={`w-full py-3.5 rounded-lg font-semibold transition-all flex justify-center items-center gap-2 text-base ${name.length >= 3
                                ? 'bg-[#217346] text-white shadow-md hover:bg-[#1a5c37]'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <span>Mulai Kuis</span>
                            {name.length >= 3 && <ArrowRight size={20} />}
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
