import { useClock } from '@/hooks/useClock';
import { getDailyQuote } from '@/utils/quotes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function HeroClock() {
  const now = useClock();
  const quote = getDailyQuote();

  return (
    <div className="glass-card p-6 md:p-8 animate-fadeUp relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-electric-500/20 blur-3xl pointer-events-none" />
      <p className="text-muted text-sm capitalize mb-1">
        {format(now, 'EEEE d MMMM yyyy', { locale: fr })}
      </p>
      <p className="font-display text-5xl md:text-6xl font-semibold tracking-tight text-white tabular-nums">
        {format(now, 'HH:mm:ss')}
      </p>
      <p className="mt-4 text-sm text-electric-400 italic max-w-md">"{quote}"</p>
    </div>
  );
}
