// @ts-nocheck
import React from 'react';
import { BookOpen, User as UserIcon, Lock } from 'lucide-react';

export default function ModernWelcome({ onStudentClick, onTeacherClick }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
            {/* Gradient Background Overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 -z-10"></div>

            {/* Modern Card with Solid Background */}
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-gray-200">
                {/* Animated Logo */}
                <div className="w-24 h-24 bg-[#217346] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <BookOpen size={48} className="text-white" strokeWidth={2} />
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-2 text-gray-900">
                    Excel IF Master
                </h1>
                <p className="text-gray-600 mb-8 font-medium text-base">
                    Kuis Interaktif Belajar Rumus IF
                </p>

                {/* Modern Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={onStudentClick}
                        className="w-full py-4 bg-[#217346] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#1a5c37] hover:shadow-xl transition-all flex justify-center items-center gap-3"
                    >
                        <UserIcon size={24} strokeWidth={2} />
                        <span>Siswa</span>
                    </button>

                    <button
                        onClick={onTeacherClick}
                        className="w-full py-3 bg-white border-2 border-[#217346] text-[#217346] rounded-xl font-semibold hover:bg-[#217346] hover:text-white transition-all flex justify-center items-center gap-2 shadow-md"
                    >
                        <Lock size={20} strokeWidth={2} />
                        <span>Guru</span>
                    </button>
                </div>
            </div>

            {/* Subtle hint text */}
            <p className="text-gray-500 text-sm font-medium">
                Powered by React & Firebase
            </p>
        </div>
    );
}
