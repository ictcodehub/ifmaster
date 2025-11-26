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
            setModal({ type: 'correct', message: bonus > 0 ? `Benar! Bonus +${bonus}!` : 'Jawaban Benar!' });
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
                <div className="w-16 h-16 border-4 border-[#217346] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const progress = ((quizState.currentQuestionIndex + 1) / levelQs.length) * 100;

    return (
        <div className="max-w-5xl mx-auto py-6 space-y-5">
            {/* Professional Stats Bar */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-4 divide-x divide-gray-200">
                    <div className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Trophy className="text-yellow-600" size={20} strokeWidth={2} />
                        </div>
                        <div className="text-xs text-gray-500 font-medium mb-1">Skor</div>
                        <div className="text-2xl font-bold text-gray-900">{quizState.score}</div>
                    </div>

                    <div className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Heart className="text-red-500" size={20} strokeWidth={2} fill="currentColor" />
                        </div>
                        <div className="text-xs text-gray-500 font-medium mb-1">Nyawa</div>
                        <div className="text-2xl font-bold text-gray-900">{quizState.lives}</div>
                    </div>

                    <div className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Flame className="text-orange-500" size={20} strokeWidth={2} />
                        </div>
                        <div className="text-xs text-gray-500 font-medium mb-1">Streak</div>
                        <div className="text-2xl font-bold text-gray-900">{quizState.streak}</div>
                    </div>

                    <div className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Target className="text-green-600" size={20} strokeWidth={2} />
                        </div>
                        <div className="text-xs text-gray-500 font-medium mb-1">Level</div>
                        <div className="text-2xl font-bold text-gray-900">{quizState.currentLevel}</div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">Soal {quizState.currentQuestionIndex + 1} dari {levelQs.length}</span>
                        <span className="font-semibold text-[#217346]">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-[#217346] to-[#34c759] h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1.5 bg-[#217346] text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                        <Zap size={14} strokeWidth={2} />
                        <span>Level {currentQ.level}</span>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">{currentQ.question}</h3>

                {currentQ.hint && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="flex items-center gap-2 text-[#217346] hover:text-[#1a5c37] font-semibold transition-colors text-sm"
                        >
                            <Lightbulb size={18} strokeWidth={2} />
                            <span>{showHint ? 'Sembunyikan Hint' : 'Lihat Hint'}</span>
                        </button>
                        {showHint && (
                            <div className="mt-3 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r">
                                <p className="text-sm text-amber-900">{currentQ.hint}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={ans}
                            onChange={(e) => setAns(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && submit()}
                            placeholder="Ketik jawaban Anda..."
                            className="w-full px-4 py-4 pr-28 border-2 border-gray-200 rounded-lg font-mono text-base focus:border-[#217346] focus:ring-2 focus:ring-green-100 outline-none transition-all"
                            autoFocus
                        />
                        <button
                            onClick={submit}
                            disabled={!ans.trim()}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm ${ans.trim()
                                    ? 'bg-[#217346] text-white hover:bg-[#1a5c37] shadow-sm'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send size={14} />
                            <span>Kirim</span>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">
                        💡 Gunakan format Excel (contoh: =IF(A1{'>'}70,"Lulus","Gagal"))
                    </p>
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-10 border-4 ${modal.type === 'correct' ? 'border-green-500' : 'border-red-500'
                        }`}>
                        <div className={`w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-5 ${modal.type === 'correct' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                            {modal.type === 'correct' ? (
                                <Trophy size={40} className="text-green-600" strokeWidth={2} />
                            ) : (
                                <Heart size={40} className="text-red-600" strokeWidth={2} />
                            )}
                        </div>

                        <h3 className={`text-3xl font-bold text-center mb-3 ${modal.type === 'correct' ? 'text-green-700' : 'text-red-700'
                            }`}>
                            {modal.type === 'correct' ? '🎉 Hebat!' : '😔 Oops!'}
                        </h3>

                        <p className="text-gray-700 text-center mb-6 font-medium text-lg">
                            {modal.message}
                        </p>

                        <button
                            onClick={handleNext}
                            className={`w-full py-4 rounded-lg font-semibold text-base transition-all shadow-md ${modal.type === 'correct'
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
