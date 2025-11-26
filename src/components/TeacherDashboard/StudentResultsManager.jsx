import React, { useState, useEffect } from "react";
import { Download, Trash2 } from "lucide-react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, appId } from "../../lib/firebase";

export default function StudentResultsManager() {
    const [results, setResults] = useState([]);
    useEffect(() => {
        const q = query(
            collection(db, "artifacts", appId, "public", "data", "results"),
            orderBy("totalScore", "desc")
        );
        const unsubscribe = onSnapshot(q, (snap) =>
            setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        );
        return () => unsubscribe();
    }, []);

    const exportCSV = () => {
        const csv =
            "Nama,Skor,Grade\n" +
            results
                .map((r) => `${r.studentName},${r.totalScore},${r.finalGrade}`)
                .join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        a.download = "nilai.csv";
        a.click();
    };

    const handleDelete = async (id, name) => {
        if (confirm(`Hapus record ${name}?`))
            await deleteDoc(
                doc(db, "artifacts", appId, "public", "data", "results", id)
            );
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 min-h-[600px]">
            <div className="flex justify-between mb-4 items-center">
                <h3 className="text-lg font-bold text-gray-800">Hasil Nilai Siswa</h3>
                <button
                    onClick={exportCSV}
                    className="text-[#217346] bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold transition-colors border border-green-100 text-xs"
                >
                    <Download size={16} /> Download CSV
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-3 text-xs font-bold text-gray-600">Nama Siswa</th>
                            <th className="p-3 text-xs font-bold text-gray-600">Total Skor</th>
                            <th className="p-3 text-xs font-bold text-gray-600">Grade</th>
                            <th className="p-3 text-xs font-bold text-gray-600 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {results.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-3 text-sm font-medium text-gray-800">{r.studentName}</td>
                                <td className="p-3">
                                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-lg text-xs font-bold">
                                        {r.totalScore}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${r.finalGrade === 'A' ? 'bg-green-500' :
                                        r.finalGrade === 'B' ? 'bg-blue-500' :
                                            r.finalGrade === 'C' ? 'bg-yellow-500' :
                                                'bg-red-500'
                                        }`}>
                                        {r.finalGrade}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => handleDelete(r.id, r.studentName)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Hapus record"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {results.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-6 text-center text-xs text-gray-400">
                                    Belum ada data nilai siswa.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
