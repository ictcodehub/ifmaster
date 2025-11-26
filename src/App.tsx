// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import ModernWelcome from "./components/ModernWelcome";
import ModernStudentReg from "./components/ModernStudentReg";
import ModernFeedbackModal from "./components/ModernFeedbackModal";
import ModernTeacherLogin from "./components/ModernTeacherLogin";
import ModernQuizGame from "./components/ModernQuizGame";
import Footer from "./components/Footer";
import {
  Trophy,
  Heart,
  Flame,
  BookOpen,
  User as UserIcon,
  LogOut,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Download,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
} from "firebase/auth";

// --- KONFIGURASI FIREBASE ANDA (ifmaster) ---
const firebaseConfig = {
  apiKey: "AIzaSyAl3yvcFG0Daf9LVHnwaLG6ZtMNTOX9GxI",
  authDomain: "ifmaster.firebaseapp.com",
  projectId: "ifmaster",
  storageBucket: "ifmaster.firebasestorage.app",
  messagingSenderId: "326687913146",
  appId: "1:326687913146:web:ff065e37aab8c73f497e83",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// Kita gunakan nama koleksi unik agar aman
const appId = "kuis-excel-ifmaster-v1";

// --- KONFIGURASI APLIKASI ---
const PIN_GURU = "weLovemb2!"; // Password Guru

// --- HELPER FUNCTIONS ---
const normalizeAnswer = (str) => {
  if (!str) return "";
  return str
    .toUpperCase()
    .replace(/\s/g, "")
    .replace(/['`]/g, '"')
    .replace(/;/g, ",")
    .trim();
};

const calculateGrade = (score, totalMaxScore) => {
  const percentage = totalMaxScore > 0 ? (score / totalMaxScore) * 100 : 0;
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "E";
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- MAIN COMPONENT ---
export default function ExcelQuizApp() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("welcome");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Student State
  const [studentName, setStudentName] = useState("");
  const [quizState, setQuizState] = useState({
    currentLevel: 1,
    currentQuestionIndex: 0,
    score: 0,
    lives: 3,
    streak: 0,
    maxStreak: 0,
    answers: [],
    isGameOver: false,
    achievements: [],
  });

  // Auth Init
  useEffect(() => {
    const initAuth = async () => {
      // Langsung login anonymous untuk siswa/guru
      await signInAnonymously(auth);
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Questions & Randomize
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "artifacts", appId, "public", "data", "questions")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Group by level
        const byLevel = {};
        docs.forEach(d => {
          if (!byLevel[d.level]) byLevel[d.level] = [];
          byLevel[d.level].push(d);
        });

        // Shuffle each level and flatten
        let shuffledQuestions = [];
        Object.keys(byLevel).sort((a, b) => a - b).forEach(level => {
          shuffledQuestions = [...shuffledQuestions, ...shuffleArray(byLevel[level])];
        });

        setQuestions(shuffledQuestions);
      },
      (error) => {
        console.error("Error fetching questions:", error);
        // Jangan tampilkan error popup jika hanya permission awal (karena data kosong)
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Handlers
  const handleTeacherLogin = (pin) => {
    if (pin === PIN_GURU) setView("teacher-dash");
    else setErrorMsg("PIN Salah!");
  };

  const handleStartQuiz = (name) => {
    setStudentName(name);
    setQuizState({
      currentLevel: 1,
      currentQuestionIndex: 0,
      score: 0,
      lives: 3,
      streak: 0,
      maxStreak: 0,
      answers: [],
      isGameOver: false,
      achievements: [],
    });
    setView("student-quiz");
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-green-700">
        Loading App...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col">
      {/* HEADER */}
      {view !== "welcome" &&
        view !== "teacher-login" &&
        view !== "student-reg" && (
          <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-40">
            <div className="flex items-center gap-2 text-[#217346] font-bold text-lg">
              <BookOpen size={24} /> <span>Excel Master IF</span>
            </div>
            <div className="flex items-center gap-4">
              {view === "student-quiz" && (
                <div className="hidden md:flex gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1 text-yellow-600">
                    <Trophy size={16} /> {quizState.score}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <Heart size={16} fill="currentColor" /> {quizState.lives}
                  </span>
                </div>
              )}
              {view === "teacher-dash" && (
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Admin
                </span>
              )}
              <button
                onClick={() => setView("welcome")}
                className="text-gray-500 hover:text-red-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          </header>
        )}

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto p-4 flex-1">
        {view === "welcome" && (
          <ModernWelcome
            onStudentClick={() => setView("student-reg")}
            onTeacherClick={() => setView("teacher-login")}
          />
        )}

        {view === "teacher-login" && (
          <ModernTeacherLogin
            onLogin={handleTeacherLogin}
            onBack={() => setView("welcome")}
          />
        )}

        {view === "teacher-dash" && (
          <TeacherDashboard questions={questions} onError={setErrorMsg} />
        )}
        {view === "student-reg" && (
          <ModernStudentReg
            onStart={handleStartQuiz}
            onBack={() => setView("welcome")}
          />
        )}
        {view === "student-quiz" && (
          <ModernQuizGame
            questions={questions}
            studentName={studentName}
            quizState={quizState}
            setQuizState={setQuizState}
            onFinish={() => setView("student-result")}
          />
        )}
        {view === "student-result" && (
          <StudentResult
            studentName={studentName}
            quizState={quizState}
            totalQuestions={questions.length}
            onRestart={() => setView("welcome")}
          />
        )}
      </main>

      <Footer />
      <ErrorModal message={errorMsg} onClose={() => setErrorMsg(null)} />
    </div>
  );
}

// --- SUB COMPONENTS ---

function TeacherDashboard({ questions, onError }) {
  const [activeTab, setActiveTab] = useState("questions");
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      <div className="flex gap-8 border-b-2 border-gray-100 pb-1">
        <button
          onClick={() => setActiveTab("questions")}
          className={`pb-4 px-6 text-lg font-bold transition-all ${activeTab === "questions"
            ? "text-[#217346] border-b-4 border-[#217346]"
            : "text-gray-400 hover:text-gray-600"
            }`}
        >
          Bank Soal ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`pb-4 px-6 text-lg font-bold transition-all ${activeTab === "students"
            ? "text-[#217346] border-b-4 border-[#217346]"
            : "text-gray-400 hover:text-gray-600"
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

function QuestionManager({ questions, onError }) {
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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between mb-6 items-center">
        <h3 className="text-lg font-bold text-gray-800">Input Soal Baru</h3>
        <button
          onClick={seedData}
          className="bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md flex items-center gap-2 text-gray-600 text-sm font-medium transition-colors border border-gray-200"
        >
          <RefreshCw size={14} /> Seed Data
        </button>
      </div>

      <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-200">
        <div className="grid gap-4 mb-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-3">
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Level</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-sm focus:border-[#217346] focus:ring-1 focus:ring-[#217346] outline-none"
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
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Pertanyaan</label>
              <input
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:border-[#217346] focus:ring-1 focus:ring-[#217346] outline-none"
                placeholder="Tulis pertanyaan..."
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Kunci Jawaban (Rumus Excel)</label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-md font-mono text-sm focus:border-[#217346] focus:ring-1 focus:ring-[#217346] outline-none"
              placeholder='=IF(A1>70,"Lulus","Gagal")'
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Hint / Bantuan</label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:border-[#217346] focus:ring-1 focus:ring-[#217346] outline-none"
              placeholder="Contoh: Gunakan tanda kutip..."
              value={formData.hint}
              onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#217346] text-white px-4 py-2.5 rounded-md w-full font-bold text-sm hover:bg-[#1a5c37] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Save size={16} /> Simpan Soal
        </button>
      </div>

      <h3 className="text-base font-bold text-gray-800 mb-3">Daftar Soal ({questions.length})</h3>
      <div className="space-y-2">
        {questions.map((q) => (
          <div
            key={q.id}
            className="border border-gray-200 p-3 rounded-lg flex justify-between items-center bg-white hover:border-green-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${q.level === 1 ? 'bg-green-100 text-green-700' :
                q.level === 2 ? 'bg-blue-100 text-blue-700' :
                  q.level === 3 ? 'bg-yellow-100 text-yellow-700' :
                    q.level === 4 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                }`}>
                Lv.{q.level}
              </span>
              <span className="text-sm text-gray-700 font-medium line-clamp-1">{q.question}</span>
            </div>
            <button
              onClick={() => handleDelete(q.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
              title="Hapus Soal"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {questions.length === 0 && (
          <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm">
            Belum ada soal.
          </div>
        )}
      </div>
    </div>
  );
}

function StudentResultsManager() {
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
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 min-h-[600px]">
      <div className="flex justify-between mb-8 items-center">
        <h3 className="text-2xl font-bold text-gray-800">Hasil Nilai Siswa</h3>
        <button
          onClick={exportCSV}
          className="text-[#217346] bg-green-50 hover:bg-green-100 px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-colors border border-green-100"
        >
          <Download size={20} /> Download CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-5 text-base font-bold text-gray-600">Nama Siswa</th>
              <th className="p-5 text-base font-bold text-gray-600">Total Skor</th>
              <th className="p-5 text-base font-bold text-gray-600">Grade</th>
              <th className="p-5 text-base font-bold text-gray-600 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-5 text-lg font-medium text-gray-800">{r.studentName}</td>
                <td className="p-5">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-lg text-base font-bold">
                    {r.totalScore}
                  </span>
                </td>
                <td className="p-5">
                  <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${r.finalGrade === 'A' ? 'bg-green-500' :
                      r.finalGrade === 'B' ? 'bg-blue-500' :
                        r.finalGrade === 'C' ? 'bg-yellow-500' :
                          'bg-red-500'
                    }`}>
                    {r.finalGrade}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <button
                    onClick={() => handleDelete(r.id, r.studentName)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Hapus record"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan="4" className="p-10 text-center text-base text-gray-400">
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

function StudentResult({ studentName, quizState, totalQuestions, onRestart }) {
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

function ErrorModal({ message, onClose }) {
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
