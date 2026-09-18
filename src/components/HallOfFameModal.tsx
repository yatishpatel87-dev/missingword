import React, { useState, useMemo } from 'react';
import { Trophy, Crown, Flame, Award, Calendar, X, Target, Play } from 'lucide-react';
import { GameSummary, DifficultyLevel } from '../types';

interface HallOfFameModalProps {
  history: GameSummary[];
  onClose: () => void;
  onPlayMission?: () => void;
}

export const HallOfFameModal: React.FC<HallOfFameModalProps> = ({
  history,
  onClose,
  onPlayMission
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'all' | DifficultyLevel>('all');

  // Filter and sort top 10 scores
  const topScores = useMemo(() => {
    let filtered = [...history];
    if (selectedLevelFilter !== 'all') {
      filtered = filtered.filter((h) => h.level === selectedLevelFilter);
    }
    // Sort descending by totalScore, then by accuracy, then by date
    filtered.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      if (b.accuracy !== a.accuracy) {
        return b.accuracy - a.accuracy;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return filtered.slice(0, 10);
  }, [history, selectedLevelFilter]);

  const getRankBadge = (rankIndex: number) => {
    switch (rankIndex) {
      case 0:
        return {
          icon: <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />,
          label: '1st',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
          borderClass: 'border-amber-500/50 bg-amber-950/20'
        };
      case 1:
        return {
          icon: <Trophy className="w-4 h-4 text-slate-300 fill-slate-300" />,
          label: '2nd',
          badgeClass: 'bg-slate-300/20 text-slate-200 border-slate-300/60 shadow-[0_0_10px_rgba(203,213,225,0.2)]',
          borderClass: 'border-slate-400/40 bg-slate-900/40'
        };
      case 2:
        return {
          icon: <Trophy className="w-4 h-4 text-amber-600 fill-amber-600" />,
          label: '3rd',
          badgeClass: 'bg-amber-700/20 text-amber-400 border-amber-600/60 shadow-[0_0_10px_rgba(217,119,6,0.2)]',
          borderClass: 'border-amber-700/40 bg-amber-950/10'
        };
      default:
        return {
          icon: null,
          label: `#${rankIndex + 1}`,
          badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
          borderClass: 'border-slate-800/80 bg-slate-900/30'
        };
    }
  };

  return (
    <div
      id="hall-of-fame-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl my-auto text-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Hall of Fame
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Top 10 Legends
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Highest detective scores achieved from local mission records.
              </p>
            </div>
          </div>

          <button
            id="close-hall-of-fame-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Filters Bar */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedLevelFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLevelFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Levels
            </button>
            {([1, 2, 3] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedLevelFilter === lvl
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Level {lvl}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-amber-400">{topScores.length}</strong> top score{topScores.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Content Area */}
        {topScores.length === 0 ? (
          <div className="p-10 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-400 my-auto">
            <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-slate-500">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-200">
              No Hall of Fame Records Yet!
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1.5 mb-5">
              Complete your first 20-challenge mission to engrave your detective name among the all-time high scorers!
            </p>
            {onPlayMission && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPlayMission();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Start Mission Now</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-y-auto space-y-4 flex-1 pr-1">
            {/* Top 3 Podium Highlights (if at least 3 exist) */}
            {topScores.length >= 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                {/* 2nd Place */}
                <div className="order-2 sm:order-1 bg-slate-900/60 border border-slate-400/40 p-3.5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-300/20 text-slate-200 border border-slate-400/40 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-slate-300" /> 2nd Place
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Lvl {topScores[1].level}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white truncate">
                      {topScores[1].studentName || 'Student'}
                    </h4>
                    <div className="text-2xl font-black font-mono text-slate-200 mt-0.5">
                      {topScores[1].totalScore} <span className="text-xs text-slate-400 font-normal">pts</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
                    <span>Accuracy: {topScores[1].accuracy}%</span>
                    <span>Streak: {topScores[1].highestStreak}x</span>
                  </div>
                </div>

                {/* 1st Place Champion */}
                <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-950/40 to-slate-900 border-2 border-amber-500/60 p-4 rounded-2xl flex flex-col justify-between shadow-xl shadow-amber-500/10 relative overflow-hidden transform sm:-translate-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 border border-amber-400 flex items-center gap-1 shadow-sm">
                      <Crown className="w-3.5 h-3.5 fill-slate-950" /> #1 Champion
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      Lvl {topScores[0].level}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-amber-200 truncate">
                      {topScores[0].studentName || 'Student'}
                    </h4>
                    <div className="text-3xl font-black font-mono text-amber-400 mt-0.5">
                      {topScores[0].totalScore} <span className="text-sm text-amber-300/80 font-normal">pts</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-amber-300/90 mt-2 flex justify-between border-t border-amber-500/20 pt-2">
                    <span>Accuracy: {topScores[0].accuracy}%</span>
                    <span>Streak: {topScores[0].highestStreak}x</span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="order-3 sm:order-3 bg-slate-900/60 border border-amber-700/40 p-3.5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-700/20 text-amber-400 border border-amber-600/40 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" /> 3rd Place
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Lvl {topScores[2].level}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white truncate">
                      {topScores[2].studentName || 'Student'}
                    </h4>
                    <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
                      {topScores[2].totalScore} <span className="text-xs text-slate-400 font-normal">pts</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
                    <span>Accuracy: {topScores[2].accuracy}%</span>
                    <span>Streak: {topScores[2].highestStreak}x</span>
                  </div>
                </div>
              </div>
            )}

            {/* Top 10 Detailed Table */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3.5 w-16 text-center">Rank</th>
                      <th className="py-3 px-3.5">Detective Name</th>
                      <th className="py-3 px-3 text-center">Level</th>
                      <th className="py-3 px-3 text-right">Score</th>
                      <th className="py-3 px-3 text-center">Accuracy</th>
                      <th className="py-3 px-3 text-center">Max Streak</th>
                      <th className="py-3 px-3 text-center">Medal</th>
                      <th className="py-3 px-3.5 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                    {topScores.map((scoreItem, idx) => {
                      const rankData = getRankBadge(idx);
                      return (
                        <tr
                          key={scoreItem.id || idx}
                          className={`hover:bg-slate-800/40 transition-colors ${
                            idx === 0 ? 'bg-amber-950/15' : ''
                          }`}
                        >
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`inline-flex items-center justify-center gap-1 font-extrabold px-2 py-0.5 rounded-full text-xs border ${rankData.badgeClass}`}
                            >
                              {rankData.icon}
                              <span>{rankData.label}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-bold text-slate-200">
                            <span className="truncate max-w-[150px] inline-block align-middle">
                              {scoreItem.studentName || 'Student'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                              Lvl {scoreItem.level}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-black text-amber-400 text-sm sm:text-base">
                            {scoreItem.totalScore}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-400">
                            {scoreItem.accuracy}%
                            <span className="text-[10px] text-slate-500 ml-1">
                              ({scoreItem.correctCount}/{scoreItem.totalQuestions})
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-semibold text-orange-400">
                            <span className="inline-flex items-center gap-0.5">
                              <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                              {scoreItem.highestStreak}x
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {scoreItem.medal === 'gold' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                                🥇 Gold
                              </span>
                            )}
                            {scoreItem.medal === 'silver' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-600">
                                🥈 Silver
                              </span>
                            )}
                            {scoreItem.medal === 'bronze' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-700/40">
                                🥉 Bronze
                              </span>
                            )}
                            {scoreItem.medal === 'trainee' && (
                              <span className="text-[11px] text-slate-400">🎖️ Trainee</span>
                            )}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono text-slate-400 text-xs">
                            <div className="flex items-center justify-end gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span>
                                {new Date(scoreItem.timestamp).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
