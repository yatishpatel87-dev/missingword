import React, { useRef } from 'react';
import { Award, Printer, Copy, X, Check, Search, ShieldCheck, Rocket } from 'lucide-react';
import { GameSummary } from '../types';
import { ManWithFirecrackers } from './ManWithFirecrackers';

interface CertificateModalProps {
  summary: GameSummary;
  onClose: () => void;
  onLaunchRockets?: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  summary,
  onClose,
  onLaunchRockets
}) => {
  const [copied, setCopied] = React.useState(false);
  const certRef = useRef<HTMLDivElement | null>(null);

  const getRankTitle = (level: number, accuracy: number) => {
    if (accuracy >= 90) {
      if (level === 3) return 'Master Detective Chief';
      if (level === 2) return 'Senior Detective Inspector';
      return 'Ace Detective Star';
    }
    if (accuracy >= 75) {
      if (level === 3) return 'Distinguished Investigator';
      if (level === 2) return 'Detective Specialist';
      return 'Junior Detective Champion';
    }
    return 'Certified Word Detective';
  };

  const getMedalColor = () => {
    switch (summary.medal) {
      case 'gold':
        return {
          title: '🥇 Gold Achievement',
          badgeBg: 'bg-amber-100 text-amber-950 border-amber-400',
          sealColor: 'text-amber-600'
        };
      case 'silver':
        return {
          title: '🥈 Silver Achievement',
          badgeBg: 'bg-slate-100 text-slate-900 border-slate-400',
          sealColor: 'text-slate-600'
        };
      case 'bronze':
        return {
          title: '🥉 Bronze Achievement',
          badgeBg: 'bg-orange-100 text-orange-950 border-orange-400',
          sealColor: 'text-orange-700'
        };
      default:
        return {
          title: '🎖️ Detective Participant',
          badgeBg: 'bg-blue-100 text-blue-950 border-blue-400',
          sealColor: 'text-blue-700'
        };
    }
  };

  const medalData = getMedalColor();
  const rank = getRankTitle(summary.level, summary.accuracy);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `📜 MISSING WORD DETECTIVE CERTIFICATE OF EXCELLENCE
Awarded to: ${summary.studentName || 'Student'}
Detective Rank: ${rank}
Level: ${summary.level} | Achievement: ${summary.medal.toUpperCase()}
Score: ${summary.totalScore} pts | Accuracy: ${summary.accuracy}% (${summary.correctCount}/${summary.totalQuestions})
Date: ${new Date(summary.timestamp).toLocaleDateString()}
Missing Word Detective Academy (sentenceમાં ખૂટતો યોગ્ય word લખવાનો)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="certificate-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl my-auto">
        {/* Modal Controls */}
        <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Official Detective Certificate
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {onLaunchRockets && (
              <button
                id="cert-fire-rockets-btn"
                type="button"
                onClick={onLaunchRockets}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900/90 text-red-300 hover:text-red-100 text-xs font-bold border border-red-500/40 transition-all shadow-sm cursor-pointer"
                title="Fire Rocket Blow for 10 Seconds"
              >
                <Rocket className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                <span>🚀 Fire Rocket Blow (10s)</span>
              </button>
            )}

            <button
              id="copy-cert-btn"
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              title="Copy credentials summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              id="print-cert-btn"
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              id="close-cert-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div
          ref={certRef}
          id="printable-certificate-canvas"
          className="relative bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50 text-slate-900 p-6 sm:p-10 rounded-2xl border-8 border-double border-amber-700 shadow-xl overflow-hidden"
        >
          {/* Corner flourish ornaments */}
          <div className="absolute top-2 left-2 text-amber-800/40 text-xl font-serif">❧</div>
          <div className="absolute top-2 right-2 text-amber-800/40 text-xl font-serif">❧</div>
          <div className="absolute bottom-2 left-2 text-amber-800/40 text-xl font-serif">❧</div>
          <div className="absolute bottom-2 right-2 text-amber-800/40 text-xl font-serif">❧</div>

          {/* Certificate Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2 text-amber-900">
              <Search className="w-7 h-7 text-amber-800" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-amber-800">
                Missing Word Detective Academy
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-black text-amber-950 tracking-tight">
              Certificate of Detective Excellence
            </h1>
            <p className="text-xs sm:text-sm font-medium text-amber-800 italic mt-1">
              વાક્યમાં ખૂટતો યોગ્ય શબ્દ શોધવામાં શ્રેષ્ઠ પ્રદર્શન બદલ સન્માન પત્ર
            </p>
          </div>

          {/* Recipient Details */}
          <div className="text-center my-6">
            <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-1">
              THIS RECOGNITION IS PROUDLY CONFERRED UPON
            </p>
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 border-b-2 border-dashed border-amber-800/60 inline-block px-8 py-1 my-2">
              {summary.studentName || 'Distinguished Student'}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto mt-2 leading-relaxed">
              for demonstrating keen analytical acumen, swift vocabulary deduction, and masterfully identifying missing words across{' '}
              <span className="font-bold text-slate-900">20 Challenges</span> in{' '}
              <span className="font-bold text-amber-900">Level {summary.level}</span>.
            </p>
          </div>

          {/* Badge & Achievement Banner */}
          <div className="flex flex-wrap items-center justify-center gap-4 my-6">
            <div className={`px-4 py-1.5 rounded-full border-2 font-extrabold text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5 shadow-sm ${medalData.badgeBg}`}>
              <ShieldCheck className="w-4 h-4" />
              <span>{medalData.title}</span>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-amber-900/10 border border-amber-900/30 text-amber-950 font-bold text-xs sm:text-sm">
              Detective Rank: <span className="font-extrabold">{rank}</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-amber-100/70 border border-amber-300 rounded-xl text-center text-xs sm:text-sm font-semibold text-slate-800 my-4">
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold">Total Score</div>
              <div className="text-base sm:text-lg font-mono font-extrabold text-amber-900">
                {summary.totalScore} pts
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold">Solved Accuracy</div>
              <div className="text-base sm:text-lg font-mono font-extrabold text-emerald-800">
                {summary.accuracy}% ({summary.correctCount}/20)
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold">Max Streak</div>
              <div className="text-base sm:text-lg font-mono font-extrabold text-orange-800">
                {summary.highestStreak}x Combo
              </div>
            </div>
          </div>

          {/* Footer: Signatures & Date */}
          <div className="flex items-end justify-between pt-6 mt-6 border-t border-amber-800/30 text-xs sm:text-sm">
            <div className="text-left">
              <div className="font-serif italic font-bold text-slate-800 text-base">
                Chief Inspector Wordly
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Director of Detective Training
              </div>
            </div>

            {/* Academy Gold Seal */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-amber-600 bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow-md">
                <Search className="w-6 h-6 sm:w-7 sm:h-7 text-amber-950" />
              </div>
              <span className="text-[9px] uppercase font-bold tracking-wider text-amber-900 mt-1">
                Official Academy Seal
              </span>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
                {new Date(summary.timestamp).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Date of Certification
              </div>
            </div>
          </div>
        </div>

        {/* Footer info, Celebrator character, and Fire Rocket button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <ManWithFirecrackers
              size="sm"
              enableAudio={false}
              autoBlowInterval={2500}
            />
            <div className="text-xs text-slate-300">
              <div className="font-extrabold text-amber-300 flex items-center gap-1.5 text-sm">
                <span>🎉 Certificate Generated Successfully!</span>
              </div>
              <div className="text-slate-400 mt-0.5">
                Verified for Detective <strong className="text-white">{summary.studentName || 'Student'}</strong> (Level {summary.level}).
              </div>
              <div className="text-[11px] text-amber-400/80 mt-1">
                Tip: Click the detective to blow more firecrackers! 💥
              </div>
            </div>
          </div>

          {onLaunchRockets && (
            <button
              id="cert-bottom-rockets-btn"
              type="button"
              onClick={onLaunchRockets}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Rocket className="w-4 h-4" />
              <span>🚀 Fire Rocket Blow for 10 Seconds!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
