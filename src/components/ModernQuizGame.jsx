// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Trophy, Heart, Flame, Lightbulb, Send, Target, Zap } from 'lucide-react';

export default function ModernQuizGame({ questions, studentName, quizState, setQuizState, onFinish }) {
    const [ans, setAns] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [modal, setModal] = useState(null);

    const levelQs = useMemo(
        () => questions.filter((q) => q.level === quizState.currentLevel),
        [questions, quizState.currentLevel]
    );
    const currentQ = levelQs[quizState.currentQuestionIndex];

    const normalizeAnswer = (str) => {
        if (!str) return '';
        return str.toUpperCase().replace(/\s/g, '').replace(/['`]/g, '"').replace(/;/g, ',').trim();
    };

    const submit = () => {
        if (!currentQ || !ans.trim()) return;
        const isCorrect = normalizeAnswer(ans) === normalizeAnswer(currentQ.answer);

        if (isCorrect) {
            const bonus = (quizState.streak + 1) % 3 === 0 ? 10 : 0;
            setQuizState((p) => ({ ...p, score: p.score + 20 + bonus, streak: p.streak + 1 }));
            setModal({ type: 'correct', message: bonus > 0 ? `Benar! Bonus +${bonus}!` : 'Benar!' });
        } else {
            const newLives = quizState.lives - 1;
            setQuizState((p) => ({ ...p, lives: newLives, score: Math.max(0, p.score - 3), streak: 0 }));
            setModal({
                type: 'wrong',
                message: newLives <= 0 ? 'Game Over!' : 'Salah! -1 Nyawa',
                isGameOver: newLives <= 0
            });
        }
    };

    const handleNext = () => {
        setModal(null);
        setAns('');
        setShowHint(false);

        if (quizState.lives <= 0) {
            setQuizState((p) => ({ ...p, lives: 3, currentQuestionIndex: 0, streak: 0 }));
            return;
        }

        if (quizState.currentQuestionIndex + 1 >= levelQs.length) {
            if (quizState.currentLevel >= 5) onFinish();
            else setQuizState((p) => ({ ...p, currentLevel: p.currentLevel + 1, currentQuestionIndex: 0, lives: 3 }));
        } else {
            setQuizState((p) => ({ ...p, currentQuestionIndex: p.currentQuestionIndex + 1 }));
        }
    };

    if (!currentQ) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-[#217346] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const progress = ((quizState.currentQuestionIndex + 1) / levelQs.length) * 100;

    return (
        <div className="max-w-3xl mx-auto py-3 space-y-3">
            {/* Compact Stats */}
            <div className="bg-white rounded-lg shadow-md p-2.5 border border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1.5 rounded-md">
                        <Trophy className="text-yellow-600" size={16} strokeWidth={2} />
                        <div>
                            <div className="text-xs text-yellow-700">Skor</div>
                            <div className="text-sm font-bold text-yellow-800">{quizState.score}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1.5 rounded-md">
                        <Heart className="text-red-600" size={16} strokeWidth={2} fill="currentColor" />
                        <div>
                            <div className="text-xs text-red-700">Nyawa</div>
                            <div className="text-sm font-bold text-red-800">{quizState.lives}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1.5 rounded-md">
                        <Flame className="text-orange-600" size={16} strokeWidth={2} />
                        <div>
                            <div className="text-xs text-orange-700">Streak</div>
                            <div className="text-sm font-bold text-orange-800">{quizState.streak}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-md">
                        <Target className="text-green-600" size={16} strokeWidth={2} />
                        <div>
                            <div className="text-xs text-green-700">Level</div>
                            <div className="text-sm font-bold text-green-800">{quizState.currentLevel}</div>
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Soal {quizState.currentQuestionIndex + 1}/{levelQs.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-gradient-to-r from-[#217346] to-[#34c759] h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Compact Question */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <div className="inline-flex items-center gap-1 bg-[#217346] text-white px-2.5 py-1 rounded-full mb-3 text-xs font-semibold">
                    <Zap size={12} strokeWidth={2} />
                    <span>Level {currentQ.level}</span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-3">{currentQ.question}</h3>

                {currentQ.hint && (
                    <div className="mb-3">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="flex items-center gap-1 text-[#217346] hover:text-[#1a5c37] font-semibold transition-colors text-xs"
                        >
                            <Lightbulb size={14} strokeWidth={2} />
                            <span>{showHint ? 'Sembunyikan Hint' : 'Lihat Hint'}</span>
                        </button>
                        {showHint && (
                            <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2.5 rounded-r text-xs text-yellow-800">
                                {currentQ.hint}
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <div className="relative">
                        <input
                            type="text"
                            value={ans}
                            onChange={(e) => setAns(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && submit()}
                            placeholder="Ketik jawaban..."
                            className="w-full p-2.5 pr-20 border-2 border-gray-300 rounded-lg text-sm font-mono focus:border-[#217346] focus:ring-2 focus:ring-green-100 transition-all bg-gray-50"
                            autoFocus
                        />
                        <button
                            onClick={submit}
                            disabled={!ans.trim()}
                            className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1 text-xs ${ans.trim()
                                    ? 'bg-[#217346] text-white hover:bg-[#1a5c37] shadow-sm'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <Send size={12} strokeWidth={2} />
                            <span>Kirim</span>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 italic">
                        💡 Format Excel: =IF(A1{'>'}70;"Lulus";"Gagal")
                    </p>
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 ${modal.type === 'correct' ? 'border-4 border-green-400' : 'border-4 border-red-400'
                        }`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${modal.type === 'correct' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                            {modal.type === 'correct' ? (
                                <Trophy size={36} className="text-green-600" strokeWidth={2} />
                            ) : (
                                <Heart size={36} className="text-red-600" strokeWidth={2} />
                            )}
                        </div>

                        <h3 className={`text-2xl font-bold text-center mb-2 ${modal.type === 'correct' ? 'text-green-700' : 'text-red-700'
                            }`}>
                            {modal.type === 'correct' ? '🎉 Hebat!' : '😔 Oops!'}
                        </h3>

                        <p className="text-gray-700 text-center mb-4 font-medium">
                            {modal.message}
                        </p>

                        <button
                            onClick={handleNext}
                            className={`w-full py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-sm ${modal.type === 'correct'
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : modal.isGameOver
                                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                        >
                            {modal.isGameOver ? '🔄 Coba Lagi' : '➡️ Lanjut'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
