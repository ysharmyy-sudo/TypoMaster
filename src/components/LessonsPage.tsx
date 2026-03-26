import { Lesson, User } from '../types';

interface LessonsPageProps {
  lessons: Lesson[];
  user: User;
  onStartLesson: (lesson: Lesson) => void;
}

export default function LessonsPage({ lessons, user, onStartLesson }: LessonsPageProps) {
  const categories = Array.from(new Set(lessons.map(l => l.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Typing Lessons</h1>
          <p className="mt-2 text-lg text-slate-600">Master touch typing step by step</p>
        </div>

        {categories.map((category) => {
          const categoryLessons = lessons.filter(l => l.category === category);
          
          return (
            <div key={category} className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryLessons.map((lesson) => {
                  const lessonIdNum = parseInt(lesson.id);
                  const isCompleted = !isNaN(lessonIdNum) && user.lessonsCompleted >= lessonIdNum;
                  const isLocked = !lesson.unlocked && !isCompleted;
                  const isNext = !isNaN(lessonIdNum) && (lessonIdNum === user.lessonsCompleted + 1 || (user.lessonsCompleted === 0 && lessonIdNum === 1));

                  return (
                    <div
                      key={lesson.id}
                      className={`group relative overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-lg transition-all hover:shadow-xl ${
                        isLocked
                          ? 'border-slate-200 opacity-60'
                          : isCompleted
                          ? 'border-emerald-200 hover:border-emerald-300'
                          : isNext
                          ? 'border-indigo-300 ring-4 ring-indigo-100'
                          : 'border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      {isNext && (
                        <div className="absolute right-4 top-4 rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold text-white">
                          NEXT
                        </div>
                      )}

                      <div className="mb-4 flex items-start justify-between">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold shadow-lg ${
                          isLocked
                            ? 'bg-slate-200 text-slate-400'
                            : isCompleted
                            ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-emerald-200'
                            : 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-indigo-200'
                        }`}>
                          {isLocked ? '🔒' : isCompleted ? '✓' : lesson.level}
                        </div>
                        <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1">
                          <span className="text-sm">⭐</span>
                          <span className="text-sm font-bold text-amber-600">{lesson.xpReward}</span>
                        </div>
                      </div>

                      <h3 className="mb-2 text-xl font-bold text-slate-900">{lesson.title}</h3>
                      <p className="mb-4 text-sm text-slate-600">{lesson.description}</p>

                      {lesson.keys.length > 0 && (
                        <div className="mb-4">
                          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Keys to practice:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {lesson.keys.map((key) => (
                              <span
                                key={key}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-mono text-sm font-bold text-slate-700"
                              >
                                {key.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4 flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {lesson.difficulty}
                        </span>
                      </div>

                      {!isLocked ? (
                        <button
                          onClick={() => onStartLesson(lesson)}
                          className={`w-full rounded-xl py-3 font-semibold transition-all ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200 hover:shadow-xl'
                          }`}
                        >
                          {isCompleted ? 'Practice Again' : 'Start Lesson'}
                        </button>
                      ) : (
                        <div className="rounded-xl bg-slate-100 py-3 text-center text-sm font-semibold text-slate-400">
                          Complete previous lessons to unlock
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
