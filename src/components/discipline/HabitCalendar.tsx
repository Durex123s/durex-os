import { useHabits } from '@/hooks/useHabits';

// Grille des 30 derniers jours : intensité = nombre d'habitudes cochées ce jour-là.
export function HabitCalendar() {
  const { habits } = useHabits();

  const days: string[] = [];
  const cursor = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(cursor);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const countFor = (day: string) => habits.filter((h) => h.completedDates.includes(day)).length;
  const maxCount = Math.max(1, ...habits.map(() => habits.length));

  const intensity = (count: number) => {
    if (count === 0) return 'bg-base-800';
    const ratio = count / Math.max(1, maxCount);
    if (ratio > 0.75) return 'bg-electric-500';
    if (ratio > 0.4) return 'bg-electric-500/60';
    return 'bg-electric-500/30';
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-muted mb-4">30 derniers jours</h3>
      <div className="grid grid-cols-10 gap-1.5">
        {days.map((day) => (
          <div
            key={day}
            title={`${new Date(day).toLocaleDateString('fr-FR')} — ${countFor(day)} habitude(s)`}
            className={`w-full aspect-square rounded-sm ${intensity(countFor(day))}`}
          />
        ))}
      </div>
    </div>
  );
}
