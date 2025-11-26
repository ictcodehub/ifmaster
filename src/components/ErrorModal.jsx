import React from "react";
import { AlertCircle } from "lucide-react";

export default function ErrorModal({ message, onClose }) {
    if (!message) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full border-l-4 border-red-500">
                <div className="flex items-center gap-3 text-red-600 font-bold mb-3 text-lg">
                    <AlertCircle size={24} /> Terjadi Kesalahan
                </div>
                <p className="mb-6 text-gray-600 leading-relaxed">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-lg font-bold transition-colors"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}
