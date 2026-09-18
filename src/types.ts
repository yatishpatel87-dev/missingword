export type DifficultyLevel = 1 | 2 | 3;

export type MedalType = 'gold' | 'silver' | 'bronze' | 'trainee';

export type GrammarCategory = 
  | 'Noun'
  | 'Verb'
  | 'Preposition'
  | 'Adjective'
  | 'Pronoun'
  | 'Conjunction'
  | 'Tense'
  | 'Daily Life';

export interface Question {
  id: string;
  sentenceBefore: string;
  sentenceAfter: string;
  answer: string;
  acceptableAlternatives?: string[];
  gujaratiTranslation: string;
  gujaratiMissingWord: string;
  clue: string;
  category: GrammarCategory;
  level: DifficultyLevel;
  firstLetterClue?: string;
}

export interface ChallengeResult {
  questionId: string;
  question: Question;
  studentAnswer: string;
  isCorrect: boolean;
  timeTakenSeconds: number;
  pointsEarned: number;
  streakAtTime: number;
}

export interface GameSummary {
  id: string;
  studentName: string;
  level: DifficultyLevel;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  remainingLives: number;
  totalScore: number;
  baseScore: number;
  streakBonus: number;
  timeBonus: number;
  highestStreak: number;
  medal: MedalType;
  results: ChallengeResult[];
  timestamp: string;
  completed: boolean;
  accuracy: number;
}

export interface TeacherSettings {
  timerPerQuestion: number; // default 25
  initialLives: number; // default 3
  showGujaratiClues: boolean;
  allowLetterClue: boolean;
  soundEnabled: boolean;
  totalChallengesCount: number; // default 20
}
