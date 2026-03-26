import { User, Lesson, Achievement } from '../types';

interface HomePageProps {
  user: User;
  lessons: Lesson[];
  achievements: Achievement[];
  onStartLesson: (lesson: Lesson) => void;
  onNavigate: (page: string) => void;
}

export default function HomePage({ user, lessons, achievements, onStartLesson, onNavigate }: HomePageProps) {
  const completedLessons = lessons.filter(l => l.unlocked && user.lessonsCompleted >= parseInt(l.id)).length;
  const progress = (completedLessons / lessons.length) * 100;
  const nextLesson = lessons.find(l => !l.unlocked || parseInt(l.id) > user.lessonsCompleted) || lessons[0];
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 p-8 text-white shadow-2xl shadow-indigo-200 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="mb-6 text-lg text-indigo-100">
                Continue your typing journey and master the keyboard like a pro.
              </p>
              <button
                onClick={() => onStartLesson(nextLesson)}
                className="group flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <span>Continue Learning</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-2xl" />
                <div className="relative rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-100">Your Progress</span>
                    <span className="text-2xl font-bold">{Math.round(progress)}%</span>
                  </div>
                  <div className="mb-6 h-3 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{user.wpm}</p>
                      <p className="text-xs text-indigo-100">WPM</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{user.accuracy}%</p>
                      <p className="text-xs text-indigo-100">Accuracy</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{user.streak}</p>
                      <p className="text-xs text-indigo-100">Day Streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl shadow-lg shadow-blue-200">
              ⚡
            </div>
            <p className="text-sm text-slate-500">Typing Speed</p>
            <p className="text-3xl font-bold text-slate-900">{user.wpm} <span className="text-lg font-normal text-slate-500">WPM</span></p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-2xl shadow-lg shadow-emerald-200">
              🎯
            </div>
            <p className="text-sm text-slate-500">Accuracy</p>
            <p className="text-3xl font-bold text-slate-900">{user.accuracy}%</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-2xl shadow-lg shadow-orange-200">
              🔥
            </div>
            <p className="text-sm text-slate-500">Day Streak</p>
            <p className="text-3xl font-bold text-slate-900">{user.streak} <span className="text-lg font-normal text-slate-500">days</span></p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-2xl shadow-lg shadow-amber-200">
              ⭐
            </div>
            <p className="text-sm text-slate-500">Total XP</p>
            <p className="text-3xl font-bold text-slate-900">{user.xp}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Continue Learning</h2>
                <button
                  onClick={() => onNavigate('lessons')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-4">
                {lessons.slice(0, 5).map((lesson) => {
                  const isCompleted = user.lessonsCompleted >= parseInt(lesson.id);
                  const isLocked = !lesson.unlocked && !isCompleted;
                  
                  return (
                    <div
                      key={lesson.id}
                      className={`group relative overflow-hidden rounded-xl border-2 p-4 transition-all ${
                        isLocked
                          ? 'border-slate-200 bg-slate-50 opacity-60'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50 hover:border-emerald-300'
                          : 'border-indigo-200 bg-indigo-50 hover:border-indigo-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-xl font-bold ${
                          isLocked
                            ? 'bg-slate-200 text-slate-400'
                            : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-indigo-500 text-white'
                        }`}>
                          {isLocked ? '🔒' : isCompleted ? '✓' : lesson.level}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{lesson.title}</h3>
                          <p className="text-sm text-slate-500">{lesson.description}</p>
                          <div className="mt-1 flex items-center gap-3 text-xs">
                            <span className={`rounded-full px-2 py-0.5 font-medium ${
                              lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                              lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {lesson.difficulty}
                            </span>
                            <span className="text-slate-500">+{lesson.xpReward} XP</span>
                          </div>
                        </div>
                        {!isLocked && (
                          <button
                            onClick={() => onStartLesson(lesson)}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm transition-all hover:shadow-md"
                          >
                            {isCompleted ? 'Practice' : 'Start'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Achievements</h2>
                <span className="text-sm font-medium text-slate-500">{unlockedAchievements}/{achievements.length}</span>
              </div>

              <div className="space-y-3">
                {achievements.slice(0, 6).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50'
                        : 'bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl ${
                      achievement.unlocked ? 'bg-amber-100' : 'bg-slate-200'
                    }`}>
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-900">{achievement.title}</h4>
                      <p className="text-xs text-slate-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('stats')}
                className="mt-4 w-full rounded-lg border-2 border-slate-200 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-indigo-200 hover:text-indigo-600"
              >
                View All Achievements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
