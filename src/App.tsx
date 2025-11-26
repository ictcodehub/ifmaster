// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
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
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
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
      <main className="max-w-5xl mx-auto p-4">
        {view === "welcome" && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
            <div className="bg-white p-10 rounded-2xl shadow-xl border-t-8 border-[#217346] max-w-md w-full">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#217346]">
                <BookOpen size={40} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Excel IF Master
              </h1>
              <p className="text-gray-500 mb-8">
                Kuis Interaktif Belajar Rumus IF
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setView("student-reg")}
                  className="w-full py-4 bg-[#217346] text-white rounded-xl font-bold text-lg hover:bg-[#1a5c38] flex justify-center gap-2"
                >
                  <UserIcon /> Siswa
                </button>
                <button
                  onClick={() => setView("teacher-login")}
                  className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-[#217346]"
                >
                  Guru
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "teacher-login" && (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4 text-center">Login Guru</h2>
              <input
                type="password"
                placeholder="PIN Admin"
                className="w-full p-3 border rounded-lg mb-4"
                onKeyDown={(e) =>
                  e.key === "Enter" && handleTeacherLogin(e.target.value)
                }
                id="pinInput"
              />
              <button
                onClick={() =>
                  handleTeacherLogin(document.getElementById("pinInput").value)
                }
                className="w-full bg-[#217346] text-white py-3 rounded-lg font-bold"
              >
                Masuk
              </button>
              <button
                onClick={() => setView("welcome")}
                className="w-full mt-2 text-gray-500 text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {view === "teacher-dash" && (
          <TeacherDashboard questions={questions} onError={setErrorMsg} />
        )}
        {view === "student-reg" && (
          <StudentRegistration
            onStart={handleStartQuiz}
            onBack={() => setView("welcome")}
          />
        )}
        {view === "student-quiz" && (
          <QuizGame
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

      <ErrorModal message={errorMsg} onClose={() => setErrorMsg(null)} />
    </div>
  );
}

// --- SUB COMPONENTS ---

function TeacherDashboard({ questions, onError }) {
  const [activeTab, setActiveTab] = useState("questions");
  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("questions")}
          className={`pb-2 px-4 font-semibold ${activeTab === "questions"
              ? "text-[#217346] border-b-2 border-[#217346]"
              : "text-gray-500"
            }`}
        >
          Soal ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`pb-2 px-4 font-semibold ${activeTab === "students"
              ? "text-[#217346] border-b-2 border-[#217346]"
              : "text-gray-500"
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
        answer: '=IF(A1>70;"Lulus";"Gagal")',
        hint: "=IF(kondisi;benar;salah)",
      },
      {
        level: 2,
        question: "Jika B2 = 'Hadir', tampilkan 'Masuk', else 'Alpha'.",
        answer: '=IF(B2="Hadir";"Masuk";"Alpha")',
        hint: "Pakai tanda kutip",
      },
      {
        level: 3,
        question: "Nested IF: C3>=90 'A', C3>=75 'B', else 'C'.",
        answer: '=IF(C3>=90;"A";IF(C3>=75;"B";"C"))',
        hint: "IF dalam IF",
      },
      {
        level: 4,
        question: "AND: D4>80 DAN E4='Aktif', maka 'Oke', else 'No'.",
        answer: '=IF(AND(D4>80;E4="Aktif");"Oke";"No")',
        hint: "=IF(AND(...);...;...)",
      },
      {
        level: 5,
        question: "OR: F5<60 'Remidi', F5>=90 ATAU G5='Juara' 'Top'.",
        answer: '=IF(F5<60;"Remidi";IF(OR(F5>=90;G5="Juara");"Top";"Good"))',
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-6">
        <h3 className="font-bold">Bank Soal</h3>
        <button
          onClick={seedData}
          className="bg-gray-100 px-3 py-1 rounded flex items-center gap-1 text-sm"
        >
          <RefreshCw size={14} /> Seed Data (Isi Otomatis)
        </button>
      </div>
      <div className="bg-gray-50 p-4 rounded mb-4 border">
        <div className="grid gap-2 mb-2">
          <select
            className="p-2 border rounded"
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
          <textarea
            className="p-2 border rounded h-20"
            placeholder="Pertanyaan..."
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
          />
          <input
            className="p-2 border rounded font-mono"
            placeholder="Jawaban: =IF(...)"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
          />
          <input
            className="p-2 border rounded"
            placeholder="Hint..."
            value={formData.hint}
            onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-[#217346] text-white px-4 py-2 rounded w-full"
        >
          <Save size={16} className="inline mr-1" /> Simpan
        </button>
      </div>
      <div className="space-y-2">
        {questions.map((q) => (
          <div
            key={q.id}
            className="border p-3 rounded flex justify-between bg-white"
          >
            <div>
              <span className="font-bold mr-2">Lv.{q.level}</span>{" "}
              {q.question.substring(0, 50)}...
            </div>
            <button onClick={() => handleDelete(q.id)} className="text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
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
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h3 className="font-bold">Nilai Siswa</h3>
        <button
          onClick={exportCSV}
          className="text-blue-600 flex items-center gap-1"
        >
          <Download size={16} /> CSV
        </button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nama</th>
            <th className="p-2">Skor</th>
            <th className="p-2">Grade</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{r.studentName}</td>
              <td className="p-2 font-bold">{r.totalScore}</td>
              <td className="p-2">{r.finalGrade}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleDelete(r.id, r.studentName)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Hapus record"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StudentRegistration({ onStart, onBack }) {
  const [name, setName] = useState("");
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-[#217346]">Mulai Kuis</h2>
        <input
          type="text"
          placeholder="Nama Lengkap"
          className="w-full p-3 border rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={() => name.length >= 3 && onStart(name)}
          className={`w-full py-3 rounded font-bold text-white ${name.length < 3 ? "bg-gray-300" : "bg-[#217346]"
            }`}
        >
          Mulai
        </button>
        <button onClick={onBack} className="w-full mt-2 text-gray-500">
          Kembali
        </button>
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

function QuizGame({
  questions,
  studentName,
  quizState,
  setQuizState,
  onFinish,
}) {
  const [ans, setAns] = useState("");
  const [modal, setModal] = useState(null); // { type: 'correct' | 'wrong', message: string }

  const levelQs = useMemo(
    () => questions.filter((q) => q.level === quizState.currentLevel),
    [questions, quizState.currentLevel]
  );
  const currentQ = levelQs[quizState.currentQuestionIndex];

  const submit = () => {
    if (!currentQ) return;
    const isCorrect = normalizeAnswer(ans) === normalizeAnswer(currentQ.answer);

    if (isCorrect) {
      const bonus = (quizState.streak + 1) % 3 === 0 ? 10 : 0;
      const newScore = quizState.score + 20 + bonus;

      setQuizState((p) => ({
        ...p,
        score: newScore,
        streak: p.streak + 1,
      }));

      setModal({
        type: 'correct',
        message: bonus > 0 ? `Benar! Bonus Streak +${bonus}!` : "Jawaban Benar!",
      });

    } else {
      const newLives = quizState.lives - 1;
      const newScore = Math.max(0, quizState.score - 3);

      setQuizState((p) => ({
        ...p,
        lives: newLives,
        score: newScore,
        streak: 0,
      }));

      if (newLives <= 0) {
        // Game Over Logic
        saveScore(studentName, newScore, questions.length);
        setModal({
          type: 'wrong',
          message: "Game Over! Nyawa habis.",
          isGameOver: true
        });
      } else {
        setModal({
          type: 'wrong',
          message: "Jawaban Salah! Nyawa -1",
        });
      }
    }
  };

  const handleNext = () => {
    setModal(null);
    setAns("");

    // If it was game over, restart level or go to result? 
    // Usually game over means restart from beginning or just end. 
    // Based on previous logic: "Restart Level".
    if (quizState.lives <= 0) {
      setQuizState((p) => ({
        ...p,
        lives: 3,
        currentQuestionIndex: 0,
        streak: 0,
      }));
      return;
    }

    // Move to next question
    if (quizState.currentQuestionIndex + 1 >= levelQs.length) {
      if (quizState.currentLevel >= 5) onFinish();
      else
        setQuizState((p) => ({
          ...p,
          currentLevel: p.currentLevel + 1,
          currentQuestionIndex: 0,
          lives: 3,
        }));
    } else {
      setQuizState((p) => ({
        ...p,
        currentQuestionIndex: p.currentQuestionIndex + 1,
      }));
    }
  };

  if (!currentQ)
    return (
      <div className="text-center p-10">
        Menyiapkan soal... (Pastikan Guru sudah Seed Data)
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-xl mt-4 relative">
      <div className="flex justify-between mb-4 text-sm font-bold text-gray-500">
        <span>Level {quizState.currentLevel}</span>
        <div className="flex gap-2">
          <Flame className="text-orange-500" size={18} /> {quizState.streak}{" "}
          <Heart className="text-red-500" size={18} /> {quizState.lives}
        </div>
      </div>
      <div className="text-lg mb-4 font-medium">{currentQ.question}</div>
      <div
        className="text-xs text-blue-600 mb-4 cursor-pointer"
        onClick={() => alert(currentQ.hint)}
      >
        💡 Lihat Hint
      </div>
      <input
        className="w-full p-3 border-2 rounded font-mono text-lg mb-4"
        value={ans}
        onChange={(e) => setAns(e.target.value)}
        placeholder="=IF(...)"
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <button
        onClick={submit}
        className="w-full bg-[#217346] text-white py-3 rounded font-bold hover:bg-[#1a5c38]"
      >
        Cek Jawaban
      </button>

      {/* Feedback Modal */}
      {modal && (
        <FeedbackModal
          type={modal.type}
          message={modal.message}
          onNext={handleNext}
          isGameOver={modal.isGameOver}
        />
      )}
    </div>
  );
}

function FeedbackModal({ type, message, onNext, isGameOver }) {
  return (
    <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded z-10 p-6 text-center animate-in fade-in zoom-in duration-200">
      {type === 'correct' ? (
        <CheckCircle className="text-green-500 mb-4" size={64} />
      ) : (
        <XCircle className="text-red-500 mb-4" size={64} />
      )}
      <h3 className={`text-2xl font-bold mb-2 ${type === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
        {type === 'correct' ? 'Hebat!' : 'Oops!'}
      </h3>
      <p className="text-gray-600 mb-6 text-lg">{message}</p>
      <button
        onClick={onNext}
        className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transform transition hover:scale-105 ${type === 'correct' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          }`}
      >
        {isGameOver ? "Coba Lagi" : "Lanjut"}
      </button>
    </div>
  );
}

function StudentResult({ studentName, quizState, totalQuestions, onRestart }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) return;
    saveScore(studentName, quizState.score, totalQuestions).then(() => setSaved(true));
  }, [saved]);

  return (
    <div className="text-center bg-white p-10 rounded shadow-xl max-w-md mx-auto mt-10">
      <Trophy size={60} className="mx-auto text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold">Selesai!</h2>
      <div className="text-5xl font-black my-6 text-[#217346]">
        {quizState.score}
      </div>
      <button
        onClick={onRestart}
        className="bg-[#217346] text-white px-6 py-2 rounded"
      >
        Main Lagi
      </button>
    </div>
  );
}

function ErrorModal({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
          <AlertCircle /> Error
        </div>
        <p className="mb-4 text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
