import React from 'react';
import { BarChart2, CheckCircle2, XCircle, Clock, Download, Sparkles, X } from 'lucide-react';
import { GameSummary } from '../types';

interface PerformanceReportModalProps {
  summary: GameSummary;
  onClose: () => void;
  onCelebrateFireworks: () => void;
}

export const PerformanceReportModal: React.FC<PerformanceReportModalProps> = ({
  summary,
  onClose,
  onCelebrateFireworks
}) => {
  // Compute category performance
  const categoryStats: Record<string, { correct: number; total: number }> = {};
  summary.results.forEach((res) => {
    const cat = res.question.category || 'General';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { correct: 0, total: 0 };
    }
    categoryStats[cat].total += 1;
    if (res.isCorrect) {
      categoryStats[cat].correct += 1;
    }
  });

  const totalTime = summary.results.reduce((acc, r) => acc + r.timeTakenSeconds, 0);
  const avgTime = (totalTime / Math.max(1, summary.results.length)).toFixed(1);

  const handleExportCSV = () => {
    const headers = [
      'Challenge #',
      'Sentence',
      'Student Answer',
      'Correct Answer',
      'Result',
      'Time (s)',
      'Points',
      'Category',
      'Gujarati Translation'
    ];

    const rows = summary.results.map((r, idx) => [
      idx + 1,
      `"${r.question.sentenceBefore} [___] ${r.question.sentenceAfter}"`,
      `"${r.studentAnswer}"`,
      `"${r.question.answer}"`,
      r.isCorrect ? 'Correct' : 'Wrong',
      r.timeTakenSeconds,
      r.pointsEarned,
      r.question.category,
      `"${r.question.gujaratiTranslation}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Detective_Report_${summary.studentName || 'Student'}_Lvl${summary.level}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="performance-report-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl my-auto text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Detective Performance Audit
              </h2>
              <p className="text-xs text-slate-400">
                Student: <span className="text-amber-300 font-bold">{summary.studentName}</span> | Level {summary.level} | 20 Challenges
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCelebrateFireworks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-md cursor-pointer"
              title="Launch 10-second celebratory firecrackers!"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">🎆 Firecrackers (10s)</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              title="Export Report to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-1 space-y-6 flex-1">
          {/* Top Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Final Score</div>
              <div className="text-2xl font-mono font-bold text-amber-400">
                {summary.totalScore} pts
              </div>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Accuracy</div>
              <div className="text-2xl font-mono font-bold text-emerald-400">
                {summary.accuracy}%
              </div>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Avg Time/Question</div>
              <div className="text-2xl font-mono font-bold text-blue-400">
                {avgTime}s
              </div>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Highest Streak</div>
              <div className="text-2xl font-mono font-bold text-orange-400">
                {summary.highestStreak}x
              </div>
            </div>
          </div>

          {/* Grammar Strengths & Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Grammar Category Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(categoryStats).map(([cat, stats]) => {
                const pct = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div
                    key={cat}
                    className="bg-slate-950/50 border border-slate-800 p-3 rounded-xl"
                  >
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-slate-200">{cat}</span>
                      <span
                        className={`font-mono font-bold ${
                          pct >= 80
                            ? 'text-emerald-400'
                            : pct >= 50
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {stats.correct}/{stats.total} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 80
                            ? 'bg-emerald-500'
                            : pct >= 50
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 20 Challenges Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              All 20 Challenges Step-by-Step
            </h4>
            <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3 w-12 text-center">#</th>
                      <th className="py-3 px-3">Sentence Clue</th>
                      <th className="py-3 px-3">Your Answer</th>
                      <th className="py-3 px-3">Correct Word</th>
                      <th className="py-3 px-3 text-center">Result</th>
                      <th className="py-3 px-3 text-right">Time</th>
                      <th className="py-3 px-3 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                    {summary.results.map((r, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          !r.isCorrect ? 'bg-red-950/10' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-slate-200 font-medium">
                            {r.question.sentenceBefore}
                            <span className="font-bold text-amber-400 mx-1 underline">
                              [{r.question.answer}]
                            </span>
                            {r.question.sentenceAfter}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            ગુજરાતી: {r.question.gujaratiTranslation}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono font-medium">
                          <span
                            className={
                              r.isCorrect
                                ? 'text-emerald-300'
                                : 'text-red-400 line-through'
                            }
                          >
                            {r.studentAnswer || '(Blank)'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                          {r.question.answer}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {r.isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-400 font-bold text-xs bg-red-950/60 px-2 py-0.5 rounded-full border border-red-500/30">
                              <XCircle className="w-3.5 h-3.5" /> Wrong
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">
                          <div className="flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{r.timeTakenSeconds}s</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-amber-300">
                          +{r.pointsEarned}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
