// @ts-nocheck
import React from 'react';
import { BookOpen, User as UserIcon, Lock } from 'lucide-react';

export default function ModernWelcome({ onStudentClick, onTeacherClick }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            {/* Gradient Background Overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 -z-10"></div>

            {/* Compact Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full border border-gray-200">
                {/* Logo */}
                <div className="w-16 h-16 bg-[#217346] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <BookOpen size={32} className="text-white" strokeWidth={2} />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold mb-1 text-gray-900">
                    Excel IF Master
                </h1>
                <p className="text-gray-600 mb-6 text-sm">
                    Kuis Interaktif Belajar Rumus IF
                </p>

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={onStudentClick}
                        className="w-full py-3 bg-[#217346] text-white rounded-lg font-semibold shadow-md hover:bg-[#1a5c37] hover:shadow-lg transition-all flex justify-center items-center gap-2"
                    >
                        <UserIcon size={18} strokeWidth={2} />
                        <span>Siswa</span>
                    </button>

                    <button
                        onClick={onTeacherClick}
                        className="w-full py-2.5 bg-white border-2 border-[#217346] text-[#217346] rounded-lg font-semibold hover:bg-[#217346] hover:text-white transition-all flex justify-center items-center gap-2"
                    >
                        <Lock size={16} strokeWidth={2} />
                        <span>Guru</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
