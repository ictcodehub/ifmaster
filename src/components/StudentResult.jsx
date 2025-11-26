import React, { useState, useEffect } from "react";
import { Trophy, RotateCcw } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, appId } from "../lib/firebase";
import { calculateGrade } from "../utils/helpers";

const saveScore = async (studentName, score, totalQuestions) => {
    try {
        await addDoc(collection(db, "artifacts", appId, "public", "data", "results"), {
            studentName,
            totalScore: score,
            finalGrade: calculateGrade(score, totalQuestions * 20),
            createdAt: serverTimestamp(),
        });
    } catch (e) {
        console.error("Error saving score:", e);
    }
};

export default function StudentResult({ studentName, quizState, totalQuestions, onRestart }) {
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (saved) return;
        saveScore(studentName, quizState.score, totalQuestions).then(() => setSaved(true));
    }, [saved]);

    const grade = calculateGrade(quizState.score, totalQuestions * 20);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>

                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-yellow-100 rounded-full scale-150 opacity-20 animate-pulse"></div>
                    <Trophy size={80} className="mx-auto text-yellow-500 relative z-10 drop-shadow-md" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">Kuis Selesai!</h2>
                <p className="text-gray-500 mb-6">Hebat, {studentName}!</p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Skor</div>
                    <div className="text-6xl font-black text-[#217346] mb-2 tracking-tight">
                        {quizState.score}
                    </div>
                    <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${grade === 'A' ? 'bg-green-100 text-green-700' :
                            grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                        }`}>
                        Grade {grade}
                    </div>
                </div>

                <button
                    onClick={onRestart}
                    className="w-full bg-[#217346] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#1a5c37] transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                >
                    <RotateCcw size={20} /> Main Lagi
                </button>
            </div>
        </div>
    );
}
