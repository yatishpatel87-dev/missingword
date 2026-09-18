import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, Settings, Users, Save, X, BookOpen, Check } from 'lucide-react';
import { GameSummary, Question, TeacherSettings, DifficultyLevel } from '../types';
import { STORAGE_KEYS } from '../data/questions';

interface TeacherModeModalProps {
  settings: TeacherSettings;
  onUpdateSettings: (newSettings: TeacherSettings) => void;
  gameHistory: GameSummary[];
  onClearHistory: () => void;
  onClose: () => void;
  onQuestionAdded: () => void;
}

export const TeacherModeModal: React.FC<TeacherModeModalProps> = ({
  settings,
  onUpdateSettings,
  gameHistory,
  onClearHistory,
  onClose,
  onQuestionAdded
}) => {
  const [activeTab, setActiveTab] = useState<'records' | 'add_question' | 'settings'>('records');

  // New Question Form state
  const [newLevel, setNewLevel] = useState<DifficultyLevel>(1);
  const [sentenceBefore, setSentenceBefore] = useState('');
  const [sentenceAfter, setSentenceAfter] = useState('.');
  const [answer, setAnswer] = useState('');
  const [gujaratiTranslation, setGujaratiTranslation] = useState('');
  const [gujaratiMissingWord, setGujaratiMissingWord] = useState('');
  const [clue, setClue] = useState('');
  const [category, setCategory] = useState<Question['category']>('Noun');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings local state
  const [localSettings, setLocalSettings] = useState<TeacherSettings>({ ...settings });

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentenceBefore || !answer || !gujaratiTranslation) return;

    const cleanMissingWord = gujaratiMissingWord
      .replace(/\s*[\(\[].*?[\)\]]/g, '')
      .replace(/[a-zA-Z]+/g, '')
      .trim();

    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      level: newLevel,
      sentenceBefore,
      sentenceAfter,
      answer: answer.trim(),
      acceptableAlternatives: [],
      gujaratiTranslation: gujaratiTranslation.trim(),
      gujaratiMissingWord: cleanMissingWord,
      clue: clue.trim() || 'Missing word clue',
      category,
      firstLetterClue: answer.trim().charAt(0).toUpperCase()
    };

    try {
      const existing = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.push(newQuestion);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(parsed));

      setSavedSuccess(true);
      setSentenceBefore('');
      setSentenceAfter('.');
      setAnswer('');
      setGujaratiTranslation('');
      setGujaratiMissingWord('');
      setClue('');
      onQuestionAdded();

      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    localStorage.setItem(STORAGE_KEYS.TEACHER_SETTINGS, JSON.stringify(localSettings));
    onClose();
  };

  return (
    <div
      id="teacher-mode-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl my-auto text-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Teacher Dashboard (શિક્ષક મોડ)
              </h2>
              <p className="text-xs text-slate-400">
                Manage classroom performance, create custom sentences, and adjust game parameters.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('records')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'records'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student History ({gameHistory.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add_question')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'add_question'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Challenge</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Classroom Settings</span>
          </button>
        </div>

        {/* Tab 1: Student History & Records */}
        {activeTab === 'records' && (
          <div className="overflow-y-auto space-y-4 flex-1 pr-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Recent Student Missions Completed
              </span>
              {gameHistory.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Records</span>
                </button>
              )}
            </div>

            {gameHistory.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-400">
                <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p className="font-semibold text-sm">No student records yet.</p>
                <p className="text-xs mt-1 text-slate-500">
                  When students complete a 20-question detective challenge, their scores and medals appear here!
                </p>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-3">Student Name</th>
                        <th className="py-3 px-3">Level</th>
                        <th className="py-3 px-3">Medal</th>
                        <th className="py-3 px-3">Score</th>
                        <th className="py-3 px-3">Accuracy</th>
                        <th className="py-3 px-3">Max Streak</th>
                        <th className="py-3 px-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                      {gameHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-200">
                            {item.studentName || 'Anonymous Student'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-xs bg-slate-800 font-semibold text-amber-400">
                              Lvl {item.level}
                            </span>
                          </td>
                          <td className="py-3 px-3 uppercase text-xs font-extrabold">
                            {item.medal === 'gold' && '🥇 Gold'}
                            {item.medal === 'silver' && '🥈 Silver'}
                            {item.medal === 'bronze' && '🥉 Bronze'}
                            {item.medal === 'trainee' && '🎖️ Trainee'}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-amber-400">
                            {item.totalScore}
                          </td>
                          <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">
                            {item.accuracy}% ({item.correctCount}/{item.totalQuestions})
                          </td>
                          <td className="py-3 px-3 font-mono text-orange-400 font-semibold">
                            {item.highestStreak}x
                          </td>
                          <td className="py-3 px-3 text-right text-slate-400 text-xs font-mono">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Create Custom Challenge */}
        {activeTab === 'add_question' && (
          <form onSubmit={handleSaveQuestion} className="overflow-y-auto space-y-4 flex-1 pr-1">
            {savedSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Custom sentence challenge successfully added to the question bank!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(Number(e.target.value) as DifficultyLevel)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value={1}>Level 1 (Beginner)</option>
                  <option value={2}>Level 2 (Intermediate)</option>
                  <option value={3}>Level 3 (Advanced / Master)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Grammar Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Question['category'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="Noun">Noun</option>
                  <option value="Verb">Verb</option>
                  <option value="Preposition">Preposition</option>
                  <option value="Adjective">Adjective</option>
                  <option value="Pronoun">Pronoun</option>
                  <option value="Conjunction">Conjunction</option>
                  <option value="Tense">Tense</option>
                  <option value="Daily Life">Daily Life</option>
                </select>
              </div>
            </div>

            {/* Sentence Parts */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                English Sentence (Before the missing word) *
              </label>
              <input
                type="text"
                required
                value={sentenceBefore}
                onChange={(e) => setSentenceBefore(e.target.value)}
                placeholder='e.g., "The cat jumped "'
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Missing Word (Correct Answer) *
                </label>
                <input
                  type="text"
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder='e.g., "on"'
                  className="w-full bg-slate-950 border border-amber-500/80 rounded-xl px-3.5 py-2.5 text-sm text-amber-300 font-bold outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sentence (After the missing word)
                </label>
                <input
                  type="text"
                  value={sentenceAfter}
                  onChange={(e) => setSentenceAfter(e.target.value)}
                  placeholder='e.g., " the table."'
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Gujarati Translation & Missing Word in Gujarati */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gujarati Full Translation (ગુજરાતી અનુવાદ) *
                </label>
                <input
                  type="text"
                  required
                  value={gujaratiTranslation}
                  onChange={(e) => setGujaratiTranslation(e.target.value)}
                  placeholder='દા.ત., "બિલાડી ટેબલ પર કૂદી."'
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gujarati Missing Word Clue (ખૂટતો અર્થ)
                </label>
                <input
                  type="text"
                  value={gujaratiMissingWord}
                  onChange={(e) => setGujaratiMissingWord(e.target.value)}
                  placeholder='દા.ત., "પર" (માત્ર ગુજરાતી અર્થ, અંગ્રેજી જવાબ નહીં)'
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* English Clue */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                English Detective Clue / Hint
              </label>
              <input
                type="text"
                value={clue}
                onChange={(e) => setClue(e.target.value)}
                placeholder='e.g., "Position of contact above a surface"'
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              id="submit-custom-question-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save Challenge to Bank</span>
            </button>
          </form>
        )}

        {/* Tab 3: Classroom Settings */}
        {activeTab === 'settings' && (
          <div className="overflow-y-auto space-y-5 flex-1 pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Timer Duration */}
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                  Timer Per Challenge (Seconds)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={15}
                    max={60}
                    step={5}
                    value={localSettings.timerPerQuestion}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        timerPerQuestion: Number(e.target.value)
                      })
                    }
                    className="flex-1 accent-indigo-500 cursor-pointer"
                  />
                  <span className="font-mono text-base font-extrabold text-amber-400 w-12 text-right">
                    {localSettings.timerPerQuestion}s
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Adjust from 15 seconds (fast challenge) to 60 seconds (relaxed study).
                </p>
              </div>

              {/* Number of Lives */}
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                  Starting Detective Lives (Hearts)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={localSettings.initialLives}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        initialLives: Number(e.target.value)
                      })
                    }
                    className="flex-1 accent-red-500 cursor-pointer"
                  />
                  <span className="font-mono text-base font-extrabold text-red-400 w-12 text-right">
                    {localSettings.initialLives} ❤️
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Standard is 3 lives. Allows students to make occasional mistakes.
                </p>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-sm font-bold text-slate-200">
                    Show Gujarati Context & Clues
                  </div>
                  <div className="text-xs text-slate-500">
                    Displays bilingual Gujarati translation for every sentence
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.showGujaratiClues}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      showGujaratiClues: e.target.checked
                    })
                  }
                  className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
                />
              </label>

              <div className="border-t border-slate-800 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm font-bold text-slate-200">
                      Allow First-Letter Clue Button
                    </div>
                    <div className="text-xs text-slate-500">
                      Lets struggling students reveal the starting letter
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.allowLetterClue}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        allowLetterClue: e.target.checked
                      })
                    }
                    className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <button
              id="save-classroom-settings-btn"
              type="button"
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Apply Classroom Settings</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
