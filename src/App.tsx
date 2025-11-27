// @ts-nocheck
import React, { useState, useEffect } from "react";
import { BookOpen, Trophy, Heart, LogOut } from "lucide-react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { collection, query, onSnapshot } from "firebase/firestore";

import { auth, db, appId } from "./lib/firebase";
import { shuffleArray } from "./utils/helpers";

import ModernWelcome from "./components/ModernWelcome";
import ModernStudentReg from "./components/ModernStudentReg";
import ModernTeacherLogin from "./components/ModernTeacherLogin";
import ModernQuizGame from "./components/ModernQuizGame";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentResult from "./components/StudentResult";
import ErrorModal from "./components/ErrorModal";
import Footer from "./components/Footer";

// --- KONFIGURASI APLIKASI ---
const PIN_GURU = "weLovemb2!"; // Password Guru

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
    else setErrorMsg("Incorrect PIN!");
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
      <main className={`max-w-5xl mx-auto p-4 flex-1 w-full ${['welcome', 'teacher-login', 'student-reg'].includes(view) ? 'flex flex-col justify-center items-center' : ''}`}>
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
