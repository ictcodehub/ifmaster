// @ts-nocheck
import React from 'react';
import { BookOpen, User as UserIcon, Lock } from 'lucide-react';

export default function ModernWelcome({ onStudentClick, onTeacherClick }) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 -z-10"></div>

            <div className="bg-white p-10 rounded-2xl shadow-lg max-w-lg w-full border border-gray-200">
                <div className="w-20 h-20 bg-[#217346] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md">
                    <BookOpen size={36} className="text-white" strokeWidth={2} />
                </div>

                <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">
                    Excel IF Master
                </h1>
                <p className="text-base text-center text-gray-600 mb-10">
                    Kuis Interaktif Belajar Rumus IF
                </p>

                <div className="space-y-3">
                    <button
                        onClick={onStudentClick}
                        className="w-full py-3.5 bg-[#217346] text-white rounded-lg font-semibold shadow-md hover:bg-[#1a5c37] transition-all flex justify-center items-center gap-2.5 text-base"
                    >
                        <UserIcon size={20} strokeWidth={2} />
                        <span>Masuk sebagai Siswa</span>
                    </button>

                    <button
                        onClick={onTeacherClick}
                        className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:border-[#217346] hover:text-[#217346] transition-all flex justify-center items-center gap-2.5 text-base"
                    >
                        <Lock size={18} strokeWidth={2} />
                        <span>Login Guru</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
