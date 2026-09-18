import React from 'react';
import { Search, Volume2, VolumeX, GraduationCap, User, Trophy, Flame, Rocket, FileText } from 'lucide-react';
import { DifficultyLevel } from '../types';

interface HeaderProps {
  studentName: string;
  onEditStudentName: () => void;
  level: DifficultyLevel;
  onChangeLevel: (lvl: DifficultyLevel) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTeacherMode: () => void;
  onOpenHallOfFame: () => void;
  onGenerateCertificateAndRockets: () => void;
  currentScore: number;
  streak: number;
}

export const Header: React.FC<HeaderProps> = ({
  studentName,
  onEditStudentName,
  level,
  onChangeLevel,
  soundEnabled,
  onToggleSound,
  onOpenTeacherMode,
  onOpenHallOfFame,
  onGenerateCertificateAndRockets,
  currentScore,
  streak
}) => {
  return (
    <header
      id="app-header"
      className="w-full bg-slate-900/95 text-slate-100 border-b border-slate-800 backdrop-blur sticky top-0 z-30 shadow-md"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Missing Word Detective
              </h1>
              <span className="hidden md:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ગુજરાતી સપોર્ટ
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Sentenceમાં ખૂટતો યોગ્ય word શોધીને લખવાનો કેસ
            </p>
          </div>
        </div>

        {/* Middle: Student badge & Stats */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Student Profile Chip */}
          <button
            id="student-profile-btn"
            type="button"
            onClick={onEditStudentName}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs sm:text-sm font-medium text-slate-200 transition-colors shadow-sm"
            title="Click to edit Student Name"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="max-w-[120px] sm:max-w-[160px] truncate">
              {studentName || '👦 Student'}
            </span>
          </button>

          {/* Level Switcher */}
          <div className="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700">
            {([1, 2, 3] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onChangeLevel(lvl)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  level === lvl
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Level ${lvl}`}
              >
                Lvl {lvl}
              </button>
            ))}
          </div>

          {/* Real-time score & streak pill (Clickable to open Hall of Fame) */}
          <button
            id="header-score-hall-btn"
            type="button"
            onClick={onOpenHallOfFame}
            className="hidden lg:flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/90 px-2.5 py-1 rounded-lg border border-slate-700 text-xs transition-colors cursor-pointer"
            title="View Top 10 Hall of Fame"
          >
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              {currentScore} pts
            </span>
            {streak > 1 && (
              <span className="flex items-center gap-0.5 text-orange-400 font-bold bg-orange-950/60 px-1.5 py-0.5 rounded">
                <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                {streak}x
              </span>
            )}
          </button>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          {/* Generate Certificate & Fire Rockets Button */}
          <button
            id="generate-cert-rockets-btn"
            type="button"
            onClick={onGenerateCertificateAndRockets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Generate Certificate & Fire Rocket Blow for 10 Seconds"
          >
            <Rocket className="w-4 h-4 text-slate-950 fill-slate-950 animate-bounce" />
            <span className="hidden sm:inline">📜 Certificate & 🚀 Rockets</span>
            <span className="sm:hidden">🚀 Cert</span>
          </button>

          {/* Hall of Fame Button */}
          <button
            id="hall-of-fame-nav-btn"
            type="button"
            onClick={onOpenHallOfFame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-600/50 text-xs sm:text-sm font-bold transition-all hover:shadow-amber-950/50 shadow-sm"
            title="Open Top 10 Hall of Fame"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="hidden sm:inline">Hall of Fame</span>
          </button>

          {/* Sound toggle */}
          <button
            id="sound-toggle-btn"
            type="button"
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Teacher Mode */}
          <button
            id="teacher-mode-btn"
            type="button"
            onClick={onOpenTeacherMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-200 border border-indigo-700/60 text-xs sm:text-sm font-semibold transition-all hover:shadow-indigo-950/50 shadow-sm"
            title="Open Teacher Dashboard"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Teacher Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
};
