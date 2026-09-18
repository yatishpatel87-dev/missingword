import React from 'react';
import { HeartCrack, RotateCcw, BarChart2, BookOpen } from 'lucide-react';
import { GameSummary } from '../types';

interface GameOverModalProps {
  summary: GameSummary;
  onRetry: () => void;
  onOpenReport: () => void;
  onChangeLevel: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  summary,
  onRetry,
  onOpenReport,
  onChangeLevel
}) => {
  return (
    <div
      id="game-over-screen"
      className="w-full max-w-lg mx-auto px-4 py-8 text-center"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <div className="w-16 h-16 rounded-3xl bg-red-950/80 border border-red-500/50 text-red-500 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg shadow-red-950/50">
          <HeartCrack className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Case Discontinued!
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          You ran out of lives (3 Hearts lost) on Challenge {summary.results.length} of {summary.totalQuestions}.
        </p>

        {/* Partial Stats */}
        <div className="my-6 grid grid-cols-3 gap-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-bold">Solved</div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {summary.correctCount}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-bold">Score</div>
            <div className="text-xl font-bold font-mono text-amber-400">
              {summary.totalScore}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-bold">Level</div>
            <div className="text-xl font-bold font-mono text-indigo-400">
              {summary.level}
            </div>
          </div>
        </div>

        <p className="text-xs text-amber-200/90 bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 mb-6">
          💡 &ldquo;Don&apos;t give up, Detective! Read the Gujarati clues carefully and try the case again.&rdquo;
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            id="retry-game-btn"
            type="button"
            onClick={onRetry}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again (3 Fresh Lives)</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            <span>Review Mistakes & Clues</span>
          </button>

          <button
            type="button"
            onClick={onChangeLevel}
            className="w-full py-2.5 px-4 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Switch to a different Level (Level 1 / 2 / 3)
          </button>
        </div>
      </div>
    </div>
  );
};
