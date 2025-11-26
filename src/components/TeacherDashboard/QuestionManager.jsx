import React, { useState } from "react";
import { RefreshCw, Save, Trash2 } from "lucide-react";
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, appId } from "../../lib/firebase";

export default function QuestionManager({ questions, onError }) {
    const [formData, setFormData] = useState({
        level: 1,
        question: "",
        answer: "",
        hint: "",
    });

    const handleSave = async () => {
        if (!formData.question || !formData.answer)
            return onError("Isi soal dan jawaban!");
        try {
            await addDoc(
                collection(db, "artifacts", appId, "public", "data", "questions"),
                {
                    ...formData,
                    level: Number(formData.level),
                    createdAt: serverTimestamp(),
                }
            );
            setFormData({ level: 1, question: "", answer: "", hint: "" });
            alert("Soal tersimpan!");
        } catch (e) {
            console.error(e);
            onError("Gagal simpan (Cek Permission Firestore)");
        }
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
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex justify-between mb-4 items-center">
                <h3 className="text-lg font-bold text-gray-800">Input Soal Baru</h3>
                <button
                    onClick={seedData}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-gray-700 font-medium transition-colors text-xs"
                >
                    <RefreshCw size={14} /> Seed Data (Isi Otomatis)
                </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200">
                <div className="grid gap-3 mb-3">
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-3">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Level Kesulitan</label>
                            <select
                                className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm focus:border-[#217346] outline-none"
                                value={formData.level}
                                onChange={(e) =>
                                    setFormData({ ...formData, level: e.target.value })
                                }
                            >
                                {[1, 2, 3, 4, 5].map((l) => (
                                    <option key={l} value={l}>
                                        Level {l}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-9">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Pertanyaan</label>
                            <input
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#217346] outline-none"
                                placeholder="Tulis pertanyaan di sini..."
                                value={formData.question}
                                onChange={(e) =>
                                    setFormData({ ...formData, question: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Kunci Jawaban (Rumus Excel)</label>
                        <input
                            className="w-full p-2 border border-gray-200 rounded-lg font-mono text-sm focus:border-[#217346] outline-none"
                            placeholder='=IF(A1>70,"Lulus","Gagal")'
                            value={formData.answer}
                            onChange={(e) =>
                                setFormData({ ...formData, answer: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Hint / Bantuan</label>
                        <input
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#217346] outline-none"
                            placeholder="Contoh: Gunakan tanda kutip untuk teks"
                            value={formData.hint}
                            onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="bg-[#217346] text-white px-4 py-2.5 rounded-lg w-full font-bold text-sm hover:bg-[#1a5c37] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                    <Save size={16} /> Simpan Soal
                </button>
            </div>

            <h3 className="text-base font-bold text-gray-800 mb-3">Daftar Soal ({questions.length})</h3>
            <div className="space-y-2">
                {questions.map((q) => (
                    <div
                        key={q.id}
                        className="border border-gray-200 p-3 rounded-xl flex justify-between items-center bg-white hover:border-green-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${q.level === 1 ? 'bg-green-100 text-green-700' :
                                q.level === 2 ? 'bg-blue-100 text-blue-700' :
                                    q.level === 3 ? 'bg-yellow-100 text-yellow-700' :
                                        q.level === 4 ? 'bg-orange-100 text-orange-700' :
                                            'bg-red-100 text-red-700'
                                }`}>
                                Lv.{q.level}
                            </span>
                            <span className="text-sm text-gray-700 font-medium">{q.question}</span>
                        </div>
                        <button
                            onClick={() => handleDelete(q.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus Soal"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {questions.length === 0 && (
                    <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-xs">
                        Belum ada soal. Silakan tambah manual atau gunakan Seed Data.
                    </div>
                )}
            </div>
        </div>
    );
}
