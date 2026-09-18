import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { GameScreen } from './components/GameScreen';
import { FinalScoreModal } from './components/FinalScoreModal';
import { CertificateModal } from './components/CertificateModal';
import { PerformanceReportModal } from './components/PerformanceReportModal';
import { TeacherModeModal } from './components/TeacherModeModal';
import { StudentNameModal } from './components/StudentNameModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { GameOverModal } from './components/GameOverModal';
import { FirecrackersCelebration } from './components/FirecrackersCelebration';
import { HallOfFameModal } from './components/HallOfFameModal';
import {
  DifficultyLevel,
  GameSummary,
  Question,
  TeacherSettings,
  ChallengeResult,
  MedalType
} from './types';
import { getRandomQuestions, STORAGE_KEYS } from './data/questions';
import { soundEffects } from './utils/audio';

const INITIAL_DEMO_RECORDS: GameSummary[] = [
  {
    id: 'demo-1',
    studentName: 'Inspector Aarav',
    level: 3,
    totalQuestions: 20,
    correctCount: 20,
    wrongCount: 0,
    remainingLives: 3,
    totalScore: 2840,
    baseScore: 2000,
    streakBonus: 500,
    timeBonus: 340,
    highestStreak: 20,
    medal: 'gold',
    results: [],
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    completed: true,
    accuracy: 100
  },
  {
    id: 'demo-2',
    studentName: 'Diya Sharma',
    level: 2,
    totalQuestions: 20,
    correctCount: 19,
    wrongCount: 1,
    remainingLives: 2,
    totalScore: 2520,
    baseScore: 1900,
    streakBonus: 350,
    timeBonus: 270,
    highestStreak: 14,
    medal: 'gold',
    results: [],
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    completed: true,
    accuracy: 95
  },
  {
    id: 'demo-3',
    studentName: 'Rohan Joshi',
    level: 1,
    totalQuestions: 20,
    correctCount: 19,
    wrongCount: 1,
    remainingLives: 2,
    totalScore: 2410,
    baseScore: 1900,
    streakBonus: 250,
    timeBonus: 260,
    highestStreak: 12,
    medal: 'gold',
    results: [],
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    completed: true,
    accuracy: 95
  },
  {
    id: 'demo-4',
    studentName: 'Ananya Patel',
    level: 2,
    totalQuestions: 20,
    correctCount: 18,
    wrongCount: 2,
    remainingLives: 1,
    totalScore: 2280,
    baseScore: 1800,
    streakBonus: 200,
    timeBonus: 280,
    highestStreak: 9,
    medal: 'gold',
    results: [],
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    completed: true,
    accuracy: 90
  },
  {
    id: 'demo-5',
    studentName: 'Kabir Mehta',
    level: 3,
    totalQuestions: 20,
    correctCount: 17,
    wrongCount: 3,
    remainingLives: 1,
    totalScore: 2150,
    baseScore: 1700,
    streakBonus: 175,
    timeBonus: 275,
    highestStreak: 8,
    medal: 'silver',
    results: [],
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
    completed: true,
    accuracy: 85
  }
];

export default function App() {
  // 1. Core Profile & Settings State
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.STUDENT_NAME) || 'Aarav Patel';
  });

  const [level, setLevel] = useState<DifficultyLevel>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_LEVEL);
    return saved ? (Number(saved) as DifficultyLevel) : 1;
  });

  const [teacherSettings, setTeacherSettings] = useState<TeacherSettings>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHER_SETTINGS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return {
      timerPerQuestion: 25,
      initialLives: 3,
      showGujaratiClues: true,
      allowLetterClue: true,
      soundEnabled: true,
      totalChallengesCount: 20
    };
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return teacherSettings.soundEnabled;
  });

  const [gameHistory, setGameHistory] = useState<GameSummary[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    // Seed with initial benchmark records so Hall of Fame is populated
    return INITIAL_DEMO_RECORDS;
  });

  // 2. Active Game State (20 Challenges)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lives, setLives] = useState<number>(teacherSettings.initialLives);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [results, setResults] = useState<ChallengeResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'game_over'>('playing');
  const [summary, setSummary] = useState<GameSummary | null>(null);

  // 3. UI Modals
  const [showStudentNameModal, setShowStudentNameModal] = useState<boolean>(false);
  const [showLevelModal, setShowLevelModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showTeacherModal, setShowTeacherModal] = useState<boolean>(false);
  const [showHallOfFameModal, setShowHallOfFameModal] = useState<boolean>(false);
  const [showFireworks, setShowFireworks] = useState<boolean>(false);

  // Sync sound setting
  useEffect(() => {
    soundEffects.enabled = soundEnabled;
  }, [soundEnabled]);

  // Start new mission with 20 questions
  const startNewMission = useCallback(
    (targetLevel: DifficultyLevel = level) => {
      const freshQuestions = getRandomQuestions(targetLevel, teacherSettings.totalChallengesCount || 20);
      setQuestions(freshQuestions);
      setCurrentIndex(0);
      setLives(teacherSettings.initialLives);
      setScore(0);
      setStreak(0);
      setHighestStreak(0);
      setResults([]);
      setGameState('playing');
      setSummary(null);
      setShowFireworks(false);
    },
    [level, teacherSettings.initialLives, teacherSettings.totalChallengesCount]
  );

  // Initialize on mount or level change
  useEffect(() => {
    startNewMission(level);
  }, [level, startNewMission]);

  // Handle student name save
  const handleSaveStudentName = (name: string) => {
    setStudentName(name);
    localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, name);
    setShowStudentNameModal(false);
  };

  // Handle Level Change
  const handleChangeLevel = (newLvl: DifficultyLevel) => {
    setLevel(newLvl);
    localStorage.setItem(STORAGE_KEYS.STUDENT_LEVEL, String(newLvl));
    setShowLevelModal(false);
    startNewMission(newLvl);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
    setTeacherSettings((prev) => ({ ...prev, soundEnabled: next }));
  };

  // Finish game calculation
  const finishGame = (finalResults: ChallengeResult[], completedSuccess: boolean) => {
    const totalQ = questions.length || 20;
    const correctCount = finalResults.filter((r) => r.isCorrect).length;
    const wrongCount = finalResults.filter((r) => !r.isCorrect).length;
    const accuracy = Math.round((correctCount / Math.max(1, finalResults.length)) * 100);

    // Calculate medal
    let medal: MedalType = 'trainee';
    if (completedSuccess) {
      if (accuracy >= 90) medal = 'gold';
      else if (accuracy >= 75) medal = 'silver';
      else if (accuracy >= 50) medal = 'bronze';
    }

    const baseScore = correctCount * 100;
    const streakBonus = Math.max(0, highestStreak * 25);
    const totalTimeBonus = finalResults
      .filter((r) => r.isCorrect)
      .reduce((acc, r) => acc + Math.max(0, (teacherSettings.timerPerQuestion - r.timeTakenSeconds) * 4), 0);

    const finalScore = score;

    const newSummary: GameSummary = {
      id: `game-${Date.now()}`,
      studentName,
      level,
      totalQuestions: totalQ,
      correctCount,
      wrongCount,
      remainingLives: lives,
      totalScore: finalScore,
      baseScore,
      streakBonus,
      timeBonus: totalTimeBonus,
      highestStreak,
      medal,
      results: finalResults,
      timestamp: new Date().toISOString(),
      completed: completedSuccess,
      accuracy
    };

    setSummary(newSummary);

    // Save to history
    const updatedHistory = [newSummary, ...gameHistory.slice(0, 49)];
    setGameHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(updatedHistory));

    if (completedSuccess) {
      setGameState('completed');
      soundEffects.playFanfare();
      // Automatically generate certificate and trigger 10-second firecracker blow animation with celebratory man!
      setShowCertificateModal(true);
      setShowFireworks(true);
    } else {
      setGameState('game_over');
    }
  };

  // Generate Certificate and launch 10-second fire rocket blowout celebration
  const handleGenerateCertificateAndRockets = () => {
    let targetSummary = summary;
    if (!targetSummary) {
      // Find existing game for current student or fallback to a high-achieving official certificate
      const existing =
        gameHistory.find((g) => g.studentName === studentName && g.level === level) ||
        gameHistory[0];

      if (existing) {
        targetSummary = {
          ...existing,
          studentName,
          level
        };
      } else {
        // Generate an instant honorary certificate for the detective
        targetSummary = {
          id: `cert-${Date.now()}`,
          studentName,
          level,
          totalQuestions: 20,
          correctCount: 19,
          wrongCount: 1,
          remainingLives: lives > 0 ? lives : 3,
          totalScore: Math.max(score, 2480),
          baseScore: 1900,
          streakBonus: 320,
          timeBonus: 260,
          highestStreak: Math.max(highestStreak, 14),
          medal: 'gold',
          results: results.length > 0 ? results : [],
          timestamp: new Date().toISOString(),
          completed: true,
          accuracy: 95
        };
      }
      setSummary(targetSummary);
    }

    // Open certificate modal and launch fire rockets for 10 seconds!
    setShowCertificateModal(true);
    setShowFireworks(true);
    soundEffects.playFanfare();
  };

  // Answer handler from GameScreen
  const handleAnswer = (
    userAnswer: string,
    isCorrect: boolean,
    timeTaken: number,
    points: number
  ) => {
    const currentQ = questions[currentIndex];
    const newResult: ChallengeResult = {
      questionId: currentQ.id,
      question: currentQ,
      studentAnswer: userAnswer,
      isCorrect,
      timeTakenSeconds: timeTaken,
      pointsEarned: points,
      streakAtTime: isCorrect ? streak + 1 : 0
    };

    const nextResults = [...results, newResult];
    setResults(nextResults);

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > highestStreak) {
        setHighestStreak(nextStreak);
      }
      setScore((prev) => prev + points);
    } else {
      setStreak(0);
      setLives((prev) => Math.max(0, prev - 1));
    }
  };

  // Timeout handler
  const handleTimeout = () => {
    const currentQ = questions[currentIndex];
    const newResult: ChallengeResult = {
      questionId: currentQ.id,
      question: currentQ,
      studentAnswer: '(Time Expired)',
      isCorrect: false,
      timeTakenSeconds: teacherSettings.timerPerQuestion,
      pointsEarned: 0,
      streakAtTime: 0
    };

    const nextResults = [...results, newResult];
    setResults(nextResults);
    setStreak(0);
    setLives((prev) => Math.max(0, prev - 1));
  };

  // Next Question button handler
  const handleNextQuestion = () => {
    if (lives <= 0) {
      finishGame(results, false);
      return;
    }

    if (currentIndex + 1 >= questions.length) {
      finishGame(results, true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      id="detective-app-root"
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950"
    >
      {/* 10-Second Firecracker Celebration when triggered */}
      {showFireworks && (
        <FirecrackersCelebration
          durationSeconds={10}
          onComplete={() => setShowFireworks(false)}
        />
      )}

      {/* Main Top Header */}
      <Header
        studentName={studentName}
        onEditStudentName={() => setShowStudentNameModal(true)}
        level={level}
        onChangeLevel={(lvl) => handleChangeLevel(lvl)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenTeacherMode={() => setShowTeacherModal(true)}
        onOpenHallOfFame={() => setShowHallOfFameModal(true)}
        onGenerateCertificateAndRockets={handleGenerateCertificateAndRockets}
        currentScore={score}
        streak={streak}
      />

      {/* Main Body Area */}
      <main className="flex-1 flex flex-col items-center justify-center py-4 sm:py-6">
        {gameState === 'playing' && questions.length > 0 && (
          <GameScreen
            questions={questions}
            currentIndex={currentIndex}
            level={level}
            lives={lives}
            maxLives={teacherSettings.initialLives}
            score={score}
            streak={streak}
            timerDuration={teacherSettings.timerPerQuestion}
            showGujaratiClues={teacherSettings.showGujaratiClues}
            allowLetterClue={teacherSettings.allowLetterClue}
            onAnswer={handleAnswer}
            onNextQuestion={handleNextQuestion}
            onTimeout={handleTimeout}
          />
        )}

        {gameState === 'completed' && summary && (
          <FinalScoreModal
            summary={summary}
            onPlayAgain={() => startNewMission(level)}
            onOpenCertificate={() => {
              setShowCertificateModal(true);
              setShowFireworks(true);
            }}
            onOpenReport={() => setShowReportModal(true)}
            onChangeLevel={() => setShowLevelModal(true)}
            onOpenHallOfFame={() => setShowHallOfFameModal(true)}
          />
        )}

        {gameState === 'game_over' && summary && (
          <GameOverModal
            summary={summary}
            onRetry={() => startNewMission(level)}
            onOpenReport={() => setShowReportModal(true)}
            onChangeLevel={() => setShowLevelModal(true)}
          />
        )}
      </main>

      {/* Footer info banner */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-3 text-center text-xs text-slate-500 px-4">
        <span>Missing Word Detective (ગુજરાતી સપોર્ટ) • </span>
        <button
          type="button"
          onClick={() => setShowLevelModal(true)}
          className="text-amber-400/90 hover:underline font-medium"
        >
          Level {level} Detective Challenge
        </button>
        <span> • </span>
        <button
          type="button"
          onClick={() => setShowHallOfFameModal(true)}
          className="text-yellow-400 hover:underline font-bold inline-flex items-center gap-1"
        >
          🏆 Hall of Fame (Top 10)
        </button>
        <span> • </span>
        <button
          type="button"
          onClick={handleGenerateCertificateAndRockets}
          className="text-amber-400 hover:underline font-bold inline-flex items-center gap-1"
        >
          📜 Certificate & 🚀 Rockets (10s)
        </button>
        <span> • 20 Challenges • 3 Lives</span>
      </footer>

      {/* Modals */}
      {showStudentNameModal && (
        <StudentNameModal
          currentName={studentName}
          onSave={handleSaveStudentName}
          onClose={() => setShowStudentNameModal(false)}
        />
      )}

      {showLevelModal && (
        <LevelSelectModal
          currentLevel={level}
          onSelectLevel={handleChangeLevel}
          onClose={() => setShowLevelModal(false)}
        />
      )}

      {showHallOfFameModal && (
        <HallOfFameModal
          history={gameHistory}
          onClose={() => setShowHallOfFameModal(false)}
          onPlayMission={() => {
            setShowHallOfFameModal(false);
            startNewMission(level);
          }}
        />
      )}

      {showCertificateModal && summary && (
        <CertificateModal
          summary={summary}
          onClose={() => setShowCertificateModal(false)}
          onLaunchRockets={() => setShowFireworks(true)}
        />
      )}

      {showReportModal && summary && (
        <PerformanceReportModal
          summary={summary}
          onClose={() => setShowReportModal(false)}
          onCelebrateFireworks={() => setShowFireworks(true)}
        />
      )}

      {showTeacherModal && (
        <TeacherModeModal
          settings={teacherSettings}
          onUpdateSettings={(newS) => setTeacherSettings(newS)}
          gameHistory={gameHistory}
          onClearHistory={() => {
            setGameHistory([]);
            localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);
          }}
          onClose={() => setShowTeacherModal(false)}
          onQuestionAdded={() => {
            // refresh questions
            startNewMission(level);
          }}
        />
      )}
    </div>
  );
}
