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

      <div className="flex items-center justify-between mb-1">
        <p className="text-muted text-sm capitalize">
          {format(now, 'EEEE d MMMM yyyy', { locale: fr })}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-electric-400 tracking-wider">
          <span className="status-dot w-1.5 h-1.5 rounded-full bg-electric-400" />
          <span>EN DIRECT</span>
        </div>
      </div>

      <p className="clock-glow font-display text-5xl md:text-6xl font-semibold tracking-tight text-white tabular-nums">
        {format(now, 'HH:mm:ss')}
      </p>

      <div className="heartbeat-line w-full my-4 rounded-full opacity-70" />

      <p className="text-sm text-electric-400 italic max-w-md">"{quote}"</p>
    </div>
  );
}
