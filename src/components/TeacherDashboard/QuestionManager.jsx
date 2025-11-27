import React, { useState, useEffect } from "react";
import { RefreshCw, Save, Trash2, Pencil, X, Layers } from "lucide-react";
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, appId } from "../../lib/firebase";

export default function QuestionManager({ questions, onError }) {
    const [activeLevel, setActiveLevel] = useState(1);
    const [formData, setFormData] = useState({
        level: 1,
        question: "",
        answer: "",
        hint: "",
    });
    const [editingId, setEditingId] = useState(null);

    // Sync formData level with active tab
    useEffect(() => {
        if (!editingId) {
            setFormData(prev => ({ ...prev, level: activeLevel }));
        }
    }, [activeLevel, editingId]);

    const filteredQuestions = questions.filter(q => q.level === activeLevel);

    const handleSave = async () => {
        if (!formData.question || !formData.answer)
            return onError("Isi soal dan jawaban!");
        try {
            if (editingId) {
                // Update existing question
                await updateDoc(
                    doc(db, "artifacts", appId, "public", "data", "questions", editingId),
                    {
                        ...formData,
                        level: Number(formData.level),
                    }
                );
                alert("Soal berhasil diupdate!");
            } else {
                // Add new question
                await addDoc(
                    collection(db, "artifacts", appId, "public", "data", "questions"),
                    {
                        ...formData,
                        level: Number(formData.level),
                        createdAt: serverTimestamp(),
                    }
                );
                alert("Soal tersimpan!");
            }
            setFormData({ level: activeLevel, question: "", answer: "", hint: "" });
            setEditingId(null);
        } catch (e) {
            console.error(e);
            onError("Gagal simpan (Cek Permission Firestore)");
        }
    };

    const handleEdit = (q) => {
        setFormData({
            level: q.level,
            question: q.question,
            answer: q.answer,
            hint: q.hint || "",
        });
        setEditingId(q.id);
        // If editing a question from a different level (shouldn't happen with tabs, but safety first), switch tab
        setActiveLevel(q.level);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData({ level: activeLevel, question: "", answer: "", hint: "" });
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        if (confirm("Hapus?"))
            await deleteDoc(
                doc(db, "artifacts", appId, "public", "data", "questions", id)
            );
    };

    const seedData = async () => {
        const seeds = [
            {
                level: 1,
                question: "Cek jika A1 > 70. Benar: 'Lulus', Salah: 'Gagal'.",
                answer: '=IF(A1>70,"Lulus","Gagal")',
                hint: "=IF(kondisi,benar,salah)",
            },
            {
                level: 2,
                question: "Jika B2 = 'Hadir', tampilkan 'Masuk', else 'Alpha'.",
                answer: '=IF(B2="Hadir","Masuk","Alpha")',
                hint: "Pakai tanda kutip",
            },
            {
                level: 3,
                question: "Nested IF: C3>=90 'A', C3>=75 'B', else 'C'.",
                answer: '=IF(C3>=90,"A",IF(C3>=75,"B","C"))',
                hint: "IF dalam IF",
            },
            {
                level: 4,
                question: "AND: D4>80 DAN E4='Aktif', maka 'Oke', else 'No'.",
                answer: '=IF(AND(D4>80,E4="Aktif"),"Oke","No")',
                hint: "=IF(AND(...),...,...)",
            },
            {
                level: 5,
                question: "OR: F5<60 'Remidi', F5>=90 ATAU G5='Juara' 'Top'.",
                answer: '=IF(F5<60,"Remidi",IF(OR(F5>=90,G5="Juara"),"Top","Good"))',
                hint: "Nested + OR",
            },
        ];
        try {
            for (const s of seeds)
                await addDoc(
                    collection(db, "artifacts", appId, "public", "data", "questions"),
                    { ...s, createdAt: serverTimestamp() }
                );
            alert("5 Soal Contoh Masuk!");
        } catch (e) {
            onError(
                "Gagal Seed Data. Pastikan Firestore Rules 'allow read, write: if true;' (Test Mode)"
            );
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Level Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
                {[1, 2, 3, 4, 5].map((level) => {
                    const count = questions.filter(q => q.level === level).length;
                    return (
                        <button
                            key={level}
                            onClick={() => setActiveLevel(level)}
                            className={`flex-1 py-4 px-4 text-sm font-bold whitespace-nowrap transition-all flex items-center justify-center gap-2 ${activeLevel === level
                                ? "bg-white text-[#217346] border-t-4 border-t-[#217346] shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Layers size={16} />
                            Level {level}
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeLevel === level ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                                }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="p-6">
                <div className="flex justify-between mb-6 items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                        {editingId ? `Edit Soal Level ${formData.level}` : `Input Soal Baru - Level ${activeLevel}`}
                    </h3>
                    {!editingId && (
                        <button
                            onClick={seedData}
                            className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-gray-700 font-medium transition-colors text-xs"
                        >
                            <RefreshCw size={14} /> Seed Data
                        </button>
                    )}
                </div>

                <div className={`p-5 rounded-xl mb-8 border transition-colors ${editingId ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"}`}>
                    <div className="grid gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Pertanyaan</label>
                            <input
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#217346] outline-none shadow-sm"
                                placeholder={`Tulis pertanyaan untuk Level ${activeLevel}...`}
                                value={formData.question}
                                onChange={(e) =>
                                    setFormData({ ...formData, question: e.target.value })
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Kunci Jawaban (Rumus Excel)</label>
                                <input
                                    className="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-[#217346] outline-none shadow-sm"
                                    placeholder='=IF(A1>70,"Lulus","Gagal")'
                                    value={formData.answer}
                                    onChange={(e) =>
                                        setFormData({ ...formData, answer: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Hint / Bantuan</label>
                                <input
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#217346] outline-none shadow-sm"
                                    placeholder="Contoh: Gunakan tanda kutip"
                                    value={formData.hint}
                                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className={`text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${editingId ? "bg-yellow-600 hover:bg-yellow-700 flex-1" : "bg-[#217346] hover:bg-[#1a5c37] w-full"}`}
                        >
                            <Save size={18} /> {editingId ? "Update Soal" : "Simpan Soal"}
                        </button>
                        {editingId && (
                            <button
                                onClick={handleCancelEdit}
                                className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2 flex-1"
                            >
                                <X size={18} /> Batal
                            </button>
                        )}
                    </div>
                </div>

                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Layers size={18} className="text-[#217346]" />
                    Daftar Soal Level {activeLevel}
                </h3>

                <div className="space-y-3">
                    {filteredQuestions.map((q) => (
                        <div
                            key={q.id}
                            className={`border p-4 rounded-xl flex justify-between items-center transition-all ${editingId === q.id
                                ? "border-yellow-400 bg-yellow-50 shadow-md"
                                : "border-gray-200 bg-white hover:border-green-200 hover:shadow-sm"}`}
                        >
                            <div className="flex-1 mr-4">
                                <p className="text-gray-800 font-medium mb-1">{q.question}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                        {q.answer}
                                    </span>
                                    {q.hint && (
                                        <span className="flex items-center gap-1 text-amber-600">
                                            💡 {q.hint}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(q)}
                                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                                    title="Edit Soal"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(q.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Hapus Soal"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredQuestions.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium mb-1">Belum ada soal untuk Level {activeLevel}</p>
                            <p className="text-xs text-gray-400">Gunakan form di atas untuk menambahkan soal baru.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
