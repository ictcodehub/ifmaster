// @ts-nocheck
import React from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

export default function ModernFeedbackModal({ type, message, onNext, isGameOver }) {
    const isCorrect = type === 'correct';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-overlay animate-fadeIn">
            <div className={`card-modern max-w-sm w-full mx-4 animate-scaleIn ${isCorrect ? 'border-2 border-green-400' : 'border-2 border-red-400'
                }`}>
                {/* Icon */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isCorrect ? 'bg-green-100 animate-pulse-slow' : 'bg-red-100'
                    }`}>
                    {isCorrect ? (
                        <CheckCircle size={48} className="text-green-600" />
                    ) : (
                        <XCircle size={48} className="text-red-600" />
                    )}
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-bold text-center mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                    {isCorrect ? 'Hebat!' : 'Oops!'}
                </h3>

                {/* Message */}
                <p className="text-gray-700 text-center mb-6 font-medium">
                    {message}
                </p>

                {/* Button */}
                <button
                    onClick={onNext}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${isCorrect
                            ? 'bg-gradient-excel text-white hover-lift shadow-excel'
                            : isGameOver
                                ? 'bg-gray-600 text-white hover:bg-gray-700'
                                : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                >
                    {isGameOver ? (
                        <>
                            <RotateCcw size={20} /> Coba Lagi
                        </>
                    ) : (
                        <>
                            Lanjut <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
