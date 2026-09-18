import React from 'react';
import { Target, Zap, ShieldAlert, Sparkles, X, ChevronRight } from 'lucide-react';
import { DifficultyLevel } from '../types';

interface LevelSelectModalProps {
  currentLevel: DifficultyLevel;
  onSelectLevel: (lvl: DifficultyLevel) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  currentLevel,
  onSelectLevel,
  onClose
}) => {
  const levels: {
    id: DifficultyLevel;
    name: string;
    subtitle: string;
    description: string;
    gujarati: string;
    icon: string;
    color: string;
    border: string;
  }[] = [
    {
      id: 1,
      name: 'Level 1: Junior Detective',
      subtitle: 'Beginner & Daily Words',
      description: 'Simple nouns, verbs, colors, animals, nature, and everyday home/school objects.',
      gujarati: 'સરળ શબ્દો, રોજિંદા ઉપયોગના નામ અને ક્રિયાપદો',
      icon: '🌱',
      color: 'from-emerald-950/60 to-emerald-900/40 text-emerald-300',
      border: 'border-emerald-500/50 hover:border-emerald-400'
    },
    {
      id: 2,
      name: 'Level 2: Ace Detective',
      subtitle: 'Grammar & Connections',
      description: 'Prepositions, conjunctions (neither/nor, yet), tenses, and adjectives.',
      gujarati: 'વ્યાકરણ, નામયોગી અવ્યય અને વાક્ય સંયોજકો',
      icon: '🔍',
      color: 'from-amber-950/60 to-amber-900/40 text-amber-300',
      border: 'border-amber-500/50 hover:border-amber-400'
    },
    {
      id: 3,
      name: 'Level 3: Master Detective',
      subtitle: 'Proverbs & Advanced Deduction',
      description: 'English idioms, proverbs, crime scene deductions (alibi, evidence), and complex phrasing.',
      gujarati: 'રૂઢિપ્રયોગો, કહેવતો અને અદ્યતન ડિટેક્ટીવ શબ્દભંડોળ',
      icon: '🕵️‍♂️',
      color: 'from-indigo-950/60 to-purple-900/40 text-indigo-300',
      border: 'border-indigo-500/50 hover:border-indigo-400'
    }
  ];

  return (
    <div
      id="level-select-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Select Detective Level
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose your challenge tier. Each mission contains 20 randomized questions!
          </p>
        </div>

        <div className="space-y-3">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onSelectLevel(lvl.id)}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 bg-gradient-to-r ${lvl.color} ${lvl.border} ${
                currentLevel === lvl.id ? 'ring-4 ring-amber-400/30' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span className="text-3xl">{lvl.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      {lvl.name}
                    </h4>
                    {currentLevel === lvl.id && (
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5">
                    {lvl.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {lvl.description}
                  </p>
                  <p className="text-[11px] text-amber-300/80 mt-1 italic font-medium">
                    ગુજરાતી: {lvl.gujarati}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-300">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
