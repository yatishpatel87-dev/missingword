import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Timer, Flame, CheckCircle2, XCircle, ArrowRight, BookOpen, Tag, Sparkles, Rocket } from 'lucide-react';
import { Question, ChallengeResult, DifficultyLevel } from '../types';
import { WritingBox } from './WritingBox';
import { soundEffects } from '../utils/audio';

interface GameScreenProps {
  questions: Question[];
  currentIndex: number;
  level: DifficultyLevel;
  lives: number;
  maxLives: number;
  score: number;
  streak: number;
  timerDuration: number;
  showGujaratiClues: boolean;
  allowLetterClue: boolean;
  onAnswer: (userAnswer: string, isCorrect: boolean, timeTaken: number, points: number) => void;
  onNextQuestion: () => void;
  onTimeout: () => void;
}

// Helper to strip any English answer leakage or parentheses from Gujarati meaning
const getCleanGujaratiMeaning = (raw?: string): string => {
  if (!raw) return '';
  // Strip parentheses and brackets e.g. (east), (trees)
  let cleaned = raw.replace(/\s*[\(\[].*?[\)\]]/g, '').trim();
  // Strip any Latin letters/words so English answers never appear
  cleaned = cleaned.replace(/[a-zA-Z]+/g, '').trim();
  return cleaned.replace(/[-:,]\s*$/, '').trim();
};

export const GameScreen: React.FC<GameScreenProps> = ({
  questions,
  currentIndex,
  level,
  lives,
  maxLives,
  score,
  streak,
  timerDuration,
  showGujaratiClues,
  allowLetterClue,
  onAnswer,
  onNextQuestion,
  onTimeout
}) => {
  const currentQuestion = questions[currentIndex];
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    userAnswer: string;
    points: number;
    timeTaken: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(timerDuration);
    setHasAnswered(false);
    setFeedback(null);
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        // Warning sound when <= 5 seconds
        if (prev <= 6) {
          soundEffects.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, timerDuration]);

  // Handle timeout safely outside render
  useEffect(() => {
    if (timeLeft === 0 && !hasAnswered) {
      handleTimeExpire();
    }
  }, [timeLeft, hasAnswered]);

  // When the final answer is submitted, automatically advance after brief feedback
  useEffect(() => {
    if (hasAnswered && currentIndex + 1 >= questions.length) {
      const autoFinishTimer = setTimeout(() => {
        onNextQuestion();
      }, 2500);
      return () => clearTimeout(autoFinishTimer);
    }
  }, [hasAnswered, currentIndex, questions.length, onNextQuestion]);

  // Handle timeout
  const handleTimeExpire = () => {
    if (hasAnswered) return;
    setHasAnswered(true);
    soundEffects.playWrong();
    soundEffects.playLoseLife();

    const result = {
      isCorrect: false,
      userAnswer: '(Time Expired)',
      points: 0,
      timeTaken: timerDuration
    };
    setFeedback(result);
    onTimeout();
  };

  // Check answer
  const handleSubmitWord = (typed: string) => {
    if (hasAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setHasAnswered(true);

    const timeTaken = Math.min(
      timerDuration,
      Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
    );
    const normalizedTyped = typed.trim().toLowerCase();
    const normalizedExpected = currentQuestion.answer.trim().toLowerCase();
    
    // Check alternatives
    const altMatches = currentQuestion.acceptableAlternatives?.some(
      (alt) => alt.trim().toLowerCase() === normalizedTyped
    );
    const isCorrect = normalizedTyped === normalizedExpected || Boolean(altMatches);

    // Score calculation:
    // Base points: 100
    // Time bonus: remaining seconds * 4 pts
    // Streak multiplier: 1x, 1.2x (streak 1), 1.5x (streak 2), 2.0x (streak 3+)
    let points = 0;
    if (isCorrect) {
      const basePoints = 100;
      const timeBonus = Math.max(0, timeLeft * 4);
      let multiplier = 1;
      if (streak >= 3) multiplier = 2.0;
      else if (streak === 2) multiplier = 1.5;
      else if (streak === 1) multiplier = 1.2;

      points = Math.round((basePoints + timeBonus) * multiplier);
      soundEffects.playCorrect();
      if (streak >= 2) {
        soundEffects.playStreak(streak + 1);
      }
    } else {
      soundEffects.playWrong();
      soundEffects.playLoseLife();
    }

    const res = {
      isCorrect,
      userAnswer: typed,
      points,
      timeTaken
    };
    setFeedback(res);
    onAnswer(typed, isCorrect, timeTaken, points);
  };

  if (!currentQuestion) return null;

  const timerPercentage = (timeLeft / timerDuration) * 100;
  const isTimeCritical = timeLeft <= 5;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Status Bar: 20 Challenges tracker, Lives, Timer, Streak */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl mb-5">
        {/* Step indicator: 20 challenges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Challenge {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
              Level {level}
            </span>
          </div>

          {/* Lives Indicator */}
          <div className="flex items-center gap-1.5" title={`${lives} lives remaining`}>
            {Array.from({ length: maxLives }).map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  scale: i < lives ? [1, 1.2, 1] : 1,
                  opacity: i < lives ? 1 : 0.25
                }}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                    i < lives
                      ? 'text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                      : 'text-slate-600 fill-slate-800'
                  }`}
                />
              </motion.div>
            ))}
            <span className="text-xs font-bold text-red-400 ml-1">
              {lives} {lives === 1 ? 'Life' : 'Lives'}
            </span>
          </div>
        </div>

        {/* 20 Step progress dots */}
        <div className="w-full grid grid-cols-20 gap-1 sm:gap-1.5 mb-4">
          {questions.map((_, idx) => {
            const isCurrent = idx === currentIndex;
            const isPast = idx < currentIndex;
            return (
              <div
                key={idx}
                className={`h-2 sm:h-2.5 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-amber-400 ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 scale-110'
                    : isPast
                    ? 'bg-emerald-500/80'
                    : 'bg-slate-800'
                }`}
                title={`Challenge #${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Timer Bar & Live Score info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-2 border-t border-slate-800">
          {/* Timer gauge */}
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border transition-colors ${
                isTimeCritical
                  ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-amber-400'
              }`}
            >
              <Timer className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-400">Time Remaining</span>
                <span
                  className={`font-mono text-sm font-bold ${
                    isTimeCritical ? 'text-red-400 font-extrabold animate-bounce' : 'text-slate-200'
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isTimeCritical
                      ? 'bg-red-500'
                      : timerPercentage < 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Current Score */}
          <div className="flex items-center justify-between sm:justify-center gap-2 bg-slate-800/60 py-1.5 px-3 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Total Score:</span>
            <span className="text-base font-extrabold text-amber-300 font-mono">
              {score}
            </span>
          </div>

          {/* Streak Combo Multiplier */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {streak > 0 ? (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-950/80 to-amber-950/80 border border-orange-500/50 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-300 shadow-lg">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <span>
                  {streak}x Streak{' '}
                  {streak >= 3 ? '(2.0x Combo!)' : streak === 2 ? '(1.5x Combo)' : '(1.2x)'}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">No active streak</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Detective Challenge Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background badge watermark */}
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none text-white">
          <BookOpen className="w-32 h-32" />
        </div>

        {/* Category & Clue Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <Tag className="w-3 h-3 text-amber-400" />
            Grammar: {currentQuestion.category}
          </span>

          <span className="text-xs text-slate-400 font-medium">
            Clue Clue: <span className="text-slate-300">{currentQuestion.clue}</span>
          </span>
        </div>

        {/* Sentence with missing word writing slot */}
        <div className="my-6 p-6 sm:p-8 rounded-2xl bg-slate-950/90 border border-slate-800/90 text-center shadow-inner">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed text-slate-100">
            <span>{currentQuestion.sentenceBefore}</span>
            <span
              className={`inline-block mx-1.5 px-3 sm:px-4 py-1 rounded-xl border-2 transition-all ${
                hasAnswered
                  ? feedback?.isCorrect
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-red-950/80 border-red-400 text-red-300 line-through'
                  : 'bg-amber-950/30 border-dashed border-amber-400 text-amber-300 animate-pulse'
              }`}
            >
              {hasAnswered
                ? feedback?.isCorrect
                  ? currentQuestion.answer
                  : feedback?.userAnswer || '____'
                : '________'}
            </span>
            <span>{currentQuestion.sentenceAfter}</span>
          </p>

          {/* Correct answer display if answered wrong */}
          {hasAnswered && !feedback?.isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-emerald-400 text-base sm:text-lg font-bold"
            >
              Correct Answer:{' '}
              <span className="underline decoration-emerald-400 font-mono">
                {currentQuestion.answer}
              </span>
            </motion.div>
          )}
        </div>

        {/* Gujarati Clue / Translation Box */}
        {showGujaratiClues && (
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 sm:p-5 mb-6 text-amber-200">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                ગુજરાતી અનુવાદ અને સંકેત (Gujarati Context)
              </h4>
            </div>
            <p className="text-base sm:text-lg font-medium text-amber-100 leading-relaxed">
              &ldquo;{currentQuestion.gujaratiTranslation}&rdquo;
            </p>
            {getCleanGujaratiMeaning(currentQuestion.gujaratiMissingWord) && (
              <p className="text-xs text-amber-300/80 mt-1 font-semibold">
                ખૂટતો અર્થ:{' '}
                <span className="bg-amber-900/60 px-2 py-0.5 rounded text-amber-200">
                  {getCleanGujaratiMeaning(currentQuestion.gujaratiMissingWord)}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Interactive Writing Box */}
        {!hasAnswered ? (
          <WritingBox
            currentAnswer={currentQuestion.answer}
            firstLetterClue={currentQuestion.firstLetterClue}
            disabled={hasAnswered}
            onSubmit={handleSubmitWord}
            allowLetterClue={allowLetterClue}
          />
        ) : (
          /* Feedback Banner & Next Button */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-5 rounded-2xl border ${
                feedback?.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                  : 'bg-red-950/60 border-red-500/80 text-red-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {feedback?.isCorrect ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-7 h-7 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                      {feedback?.isCorrect ? (
                        <>
                          <span>🟢 ઉત્તમ! Correct Word!</span>
                          <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                            +{feedback?.points} pts
                          </span>
                        </>
                      ) : (
                        <>
                          <span>🔴 ભૂલ! Wrong Answer!</span>
                          <span className="text-xs font-mono font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                            -1 Life
                          </span>
                        </>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      {feedback?.isCorrect
                        ? `Great detective work! Answered in ${feedback.timeTaken}s.`
                        : `The correct word was "${currentQuestion.answer}".`}
                    </p>
                  </div>
                </div>

                <button
                  id="next-challenge-btn"
                  type="button"
                  autoFocus
                  onClick={onNextQuestion}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 ${
                    currentIndex + 1 >= questions.length
                      ? 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 shadow-amber-500/30 animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/20'
                  }`}
                >
                  {currentIndex + 1 >= questions.length ? (
                    <>
                      <Rocket className="w-5 h-5 text-slate-950" />
                      <span>📜 Generate Certificate & Celebrate! 🚀</span>
                    </>
                  ) : (
                    <>
                      <span>Next Challenge ➔</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
