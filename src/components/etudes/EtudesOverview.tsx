import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { Clock, Flame, CalendarClock } from 'lucide-react';
import { db } from '@/database/db';
import { isDue } from '@/utils/spacedRepetition';

function startOfWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // lundi comme premier jour
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

const EMPTY: never[] = [];

export function EtudesOverview() {
  const sessions = useLiveQuery(() => db.pomodoroSessions.toArray(), []) ?? EMPTY;
  const flashcards = useLiveQuery(() => db.flashcards.toArray(), []) ?? EMPTY;
  const resources = useLiveQuery(() => db.resources.toArray(), []) ?? EMPTY;
  const subjects = useLiveQuery(() => db.subjects.toArray(), []) ?? EMPTY;

  const studyMinutesThisWeek = useMemo(() => {
    const monday = startOfWeek();
    return sessions
      .filter((s) => s.type === 'etude' && new Date(s.completedAt) >= monday)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [sessions]);

  const dueFlashcards = useMemo(() => flashcards.filter(isDue).length, [flashcards]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(now.getDate() + 7);
    return resources
      .filter((r) => r.dueDate && !r.done && new Date(r.dueDate) >= now && new Date(r.dueDate) <= in7Days)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 3)
      .map((r) => ({ ...r, subjectName: subjects.find((s) => s.id === r.subjectId)?.name }));
  }, [resources, subjects]);

  const hasAnyData = studyMinutesThisWeek > 0 || dueFlashcards > 0 || upcomingDeadlines.length > 0;
  if (!hasAnyData) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 text-xs text-muted mb-1">
          <Clock className="w-3.5 h-3.5" />
          Étude cette semaine
        </div>
        <p className="font-display text-xl font-semibold text-white">
          {Math.floor(studyMinutesThisWeek / 60)}h{(studyMinutesThisWeek % 60).toString().padStart(2, '0')}
        </p>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-2 text-xs text-muted mb-1">
          <Flame className="w-3.5 h-3.5" />
          Fiches à réviser
        </div>
        <p className="font-display text-xl font-semibold text-white">{dueFlashcards}</p>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-2 text-xs text-muted mb-2">
          <CalendarClock className="w-3.5 h-3.5" />
          Prochaines échéances
        </div>
        {upcomingDeadlines.length === 0 ? (
          <p className="text-xs text-muted">Rien dans les 7 prochains jours.</p>
        ) : (
          <ul className="space-y-1">
            {upcomingDeadlines.map((r) => (
              <li key={r.id}>
                <Link to={`/etudes/${r.subjectId}`} className="text-xs text-white hover:text-electric-400 transition-colors flex items-center justify-between gap-2">
                  <span className="truncate">{r.title}</span>
                  <span className="text-muted shrink-0">
                    {new Date(r.dueDate!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
