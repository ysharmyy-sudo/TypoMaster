export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  accuracy: number;
  wpm: number;
  totalTime: number;
  lessonsCompleted: number;
  achievements: string[];
  triesUsed: number;
  isPremium: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: number;
  keys: string[];
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  xpReward: number;
  unlocked: boolean;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  totalChars: number;
  timeElapsed: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  type: 'wpm' | 'accuracy' | 'lessons' | 'streak' | 'time';
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: string;
}
