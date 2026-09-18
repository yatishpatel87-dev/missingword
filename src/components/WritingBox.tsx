import React, { useState, useEffect, useRef } from 'react';
import { Send, HelpCircle, CornerDownLeft, Sparkles } from 'lucide-react';

interface WritingBoxProps {
  currentAnswer: string;
  firstLetterClue?: string;
  disabled: boolean;
  onSubmit: (typedWord: string) => void;
  allowLetterClue: boolean;
  onClueUsed?: () => void;
}

export const WritingBox: React.FC<WritingBoxProps> = ({
  currentAnswer,
  firstLetterClue,
  disabled,
  onSubmit,
  allowLetterClue,
  onClueUsed
}) => {
  const [typedWord, setTypedWord] = useState('');
  const [showFirstLetter, setShowFirstLetter] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto focus input on each question change
  useEffect(() => {
    setTypedWord('');
    setShowFirstLetter(false);
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentAnswer, disabled]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (disabled) return;
    const cleanWord = typedWord.trim();
    if (!cleanWord) return;
    onSubmit(cleanWord);
  };

  const handleRevealClue = () => {
    if (showFirstLetter || !allowLetterClue) return;
    setShowFirstLetter(true);
    if (!typedWord) {
      setTypedWord(firstLetterClue || currentAnswer.charAt(0));
    }
    if (onClueUsed) onClueUsed();
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="w-full mt-4">
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-3">
        {/* Input bar and action */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id="detective-writing-box"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              value={typedWord}
              disabled={disabled}
              onChange={(e) => setTypedWord(e.target.value)}
              placeholder={
                showFirstLetter
                  ? `Starts with "${firstLetterClue || currentAnswer.charAt(0).toUpperCase()}"... type word`
                  : 'Type the missing word here...'
              }
              className={`w-full px-4 py-3 sm:py-3.5 text-base sm:text-lg font-semibold rounded-xl border-2 transition-all outline-none ${
                disabled
                  ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-300 dark:border-slate-700 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-100 border-amber-400/80 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 shadow-sm'
              }`}
            />
            {typedWord && !disabled && (
              <button
                type="button"
                onClick={() => setTypedWord('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="submit-word-btn"
            type="submit"
            disabled={disabled || !typedWord.trim()}
            className={`px-5 py-3 sm:py-3.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-sm sm:text-base ${
              disabled || !typedWord.trim()
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:shadow-lg active:scale-95 cursor-pointer'
            }`}
          >
            <span>Submit</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Clue and helper row */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <div className="flex items-center gap-2">
            {allowLetterClue && (
              <button
                id="first-letter-clue-btn"
                type="button"
                onClick={handleRevealClue}
                disabled={showFirstLetter || disabled}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  showFirstLetter
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-800 cursor-default'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {showFirstLetter
                    ? `Clue: Starts with "${firstLetterClue || currentAnswer.charAt(0).toUpperCase()}" (${currentAnswer.length} letters)`
                    : '💡 Need Clue? (First Letter)'}
                </span>
              </button>
            )}

            <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
              <CornerDownLeft className="w-3 h-3" /> Press Enter to check
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Case-insensitive</span>
          </div>
        </div>
      </form>
    </div>
  );
};
