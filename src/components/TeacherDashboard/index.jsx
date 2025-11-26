import React, { useState } from "react";
import QuestionManager from "./QuestionManager";
import StudentResultsManager from "./StudentResultsManager";

export default function TeacherDashboard({ questions, onError }) {
    const [activeTab, setActiveTab] = useState("questions");
    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4">
            <div className="flex gap-4 border-b border-gray-200 pb-1">
                <button
                    onClick={() => setActiveTab("questions")}
                    className={`pb-2 px-3 text-sm font-bold transition-all ${activeTab === "questions"
                        ? "text-[#217346] border-b-2 border-[#217346]"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Bank Soal ({questions.length})
                </button>
                <button
                    onClick={() => setActiveTab("students")}
                    className={`pb-2 px-3 text-sm font-bold transition-all ${activeTab === "students"
                        ? "text-[#217346] border-b-2 border-[#217346]"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Hasil Siswa
                </button>
            </div>
            {activeTab === "questions" ? (
                <QuestionManager questions={questions} onError={onError} />
            ) : (
                <StudentResultsManager />
            )}
        </div>
    );
}
