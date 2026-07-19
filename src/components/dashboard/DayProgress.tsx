import { WidgetCard } from './WidgetCard';
import { CircleGauge } from 'lucide-react';
import { useAnimatedNumber } from '@/components/ui/AnimatedNumber';

export function DayProgress() {
  const now = new Date();
  const startHour = 6; // journée "active" 06h-23h, ajustable dans Paramètres plus tard
  const endHour = 23;
  const totalMinutes = (endHour - startHour) * 60;
  const elapsed = Math.max(
    0,
    Math.min(totalMinutes, (now.getHours() - startHour) * 60 + now.getMinutes())
  );
  const percent = Math.round((elapsed / totalMinutes) * 100);
  const animatedPercent = useAnimatedNumber(percent);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercent / 100) * circumference;

  return (
    <WidgetCard title="Progression de la journée" icon={<CircleGauge className="w-4 h-4" />}>
      <div className="flex items-center gap-5">
        <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
          <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="8" style={{ stroke: 'rgb(var(--color-bg-700))' }} />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgb(var(--color-accent))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="600" style={{ fill: 'rgb(var(--color-text))' }}>
            {animatedPercent}%
          </text>
        </svg>
        <div className="text-sm text-muted">
          <p>Journée active : {startHour}h–{endHour}h</p>
          <p className="mt-1 text-white">
            {percent < 100 ? `Il te reste ${Math.round((totalMinutes - elapsed) / 60)}h` : 'Journée terminée'}
          </p>
        </div>
      </div>
    </WidgetCard>
  );
}
