import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, Flame, Timer, RotateCcw, FileText, BarChart2, CheckCircle, XCircle, Rocket } from 'lucide-react';
import { GameSummary, MedalType } from '../types';
import { ManWithFirecrackers } from './ManWithFirecrackers';

interface FinalScoreModalProps {
  summary: GameSummary;
  onPlayAgain: () => void;
  onOpenCertificate: () => void;
  onOpenReport: () => void;
  onChangeLevel: () => void;
  onOpenHallOfFame: () => void;
}

export const FinalScoreModal: React.FC<FinalScoreModalProps> = ({
  summary,
  onPlayAgain,
  onOpenCertificate,
  onOpenReport,
  onChangeLevel,
  onOpenHallOfFame
}) => {
  const getMedalBadge = (medal: MedalType) => {
    switch (medal) {
      case 'gold':
        return {
          title: '🥇 Gold Detective Achievement',
          desc: 'Outstanding Detective Master! Solved almost all clues!',
          color: 'from-amber-400 to-yellow-500 text-yellow-950 border-amber-300 shadow-amber-500/30'
        };
      case 'silver':
        return {
          title: '🥈 Silver Detective Achievement',
          desc: 'Excellent Inspector! Great eye for vocabulary!',
          color: 'from-slate-200 to-slate-400 text-slate-900 border-slate-300 shadow-slate-400/30'
        };
      case 'bronze':
        return {
          title: '🥉 Bronze Detective Achievement',
          desc: 'Good Job! With a bit more practice you will be Master!',
          color: 'from-amber-600 to-orange-700 text-amber-100 border-amber-500 shadow-orange-700/30'
        };
      default:
        return {
          title: '🎖️ Detective Trainee Badge',
          desc: 'Keep training your vocabulary detective skills!',
          color: 'from-blue-600 to-indigo-700 text-blue-100 border-blue-400 shadow-blue-600/30'
        };
    }
  };

  const medalInfo = getMedalBadge(summary.medal);

  return (
    <div
      id="final-score-screen"
      className="w-full max-w-3xl mx-auto px-4 py-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Top Banner with Celebratory Man and Medal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 text-center sm:text-left">
          <div className="flex-shrink-0">
            <ManWithFirecrackers
              size="md"
              enableAudio={false}
              autoBlowInterval={2200}
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 p-2 px-3.5 rounded-full bg-slate-800/90 border border-slate-700 shadow-lg mb-2">
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">Case Solved!</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Mission Completed!
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1">
              Detective <span className="text-amber-400 font-bold">{summary.studentName}</span> has concluded the Level {summary.level} case!
            </p>

            {/* Achievement Ribbon */}
            <div className={`mt-3 inline-flex flex-col sm:flex-row items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r ${medalInfo.color} font-bold shadow-lg border`}>
              <Award className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="text-sm sm:text-base leading-tight">{medalInfo.title}</div>
                <div className="text-[11px] opacity-90 font-normal">{medalInfo.desc}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Big Final Score Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-6 text-center shadow-inner">
          <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">
            🏆 Total Final Score
          </div>
          <div className="text-4xl sm:text-6xl font-black text-amber-400 font-mono tracking-tight drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            {summary.totalScore}
          </div>
          <div className="text-xs sm:text-sm text-slate-400 mt-2 font-medium">
            Accuracy:{' '}
            <span className="text-emerald-400 font-bold font-mono text-base">
              {summary.accuracy}%
            </span>{' '}
            ({summary.correctCount} of {summary.totalQuestions} challenges solved)
          </div>
        </div>

        {/* Detailed Points Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {/* Correct Count */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Correct</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {summary.correctCount}
            </div>
          </div>

          {/* Wrong Count */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-center">
            <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Wrong</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {summary.wrongCount}
            </div>
          </div>

          {/* Highest Streak */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-xs font-bold uppercase">Max Streak</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {summary.highestStreak}x
            </div>
            <div className="text-[10px] text-slate-400">+{summary.streakBonus} pts</div>
          </div>

          {/* Time Bonus */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <Timer className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Speed Bonus</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              +{summary.timeBonus}
            </div>
            <div className="text-[10px] text-slate-400">Time saved</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 flex-wrap">
          {/* Certificate Button */}
          <button
            id="view-certificate-btn"
            type="button"
            onClick={onOpenCertificate}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer text-sm"
          >
            <FileText className="w-4 h-4" />
            <span>📜 View Certificate</span>
          </button>

          {/* Hall of Fame Button */}
          <button
            id="final-hall-of-fame-btn"
            type="button"
            onClick={onOpenHallOfFame}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-extrabold border border-amber-500/50 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm shadow-md"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>🏆 Hall of Fame</span>
          </button>

          {/* Performance Report */}
          <button
            id="view-report-btn"
            type="button"
            onClick={onOpenReport}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
          >
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            <span>📊 Progress Report</span>
          </button>

          {/* Play Again */}
          <button
            id="play-again-btn"
            type="button"
            onClick={onPlayAgain}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>

        {/* Switch level link */}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={onChangeLevel}
            className="text-xs text-slate-400 hover:text-amber-400 underline underline-offset-4 transition-colors"
          >
            Choose a different difficulty level (Level 1 / 2 / 3)
          </button>
        </div>
      </motion.div>
    </div>
  );
};
