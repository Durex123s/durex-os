import type { LucideIcon } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  step: string; // à quelle étape du plan ce module sera construit
}

// Écran d'attente cohérent avec le design system, affiché tant qu'un module
// n'a pas encore été implémenté dans le plan par étapes.
export function ModulePlaceholder({ title, description, icon: Icon, step }: ModulePlaceholderProps) {
  return (
    <div className="glass-card p-10 flex flex-col items-center text-center max-w-lg mx-auto mt-16 animate-fadeUp">
      <div className="w-14 h-14 rounded-2xl bg-electric-500/10 border border-electric-500/30 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-electric-400" strokeWidth={1.75} />
      </div>
      <h2 className="font-display text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-muted text-sm mb-4">{description}</p>
      <span className="text-xs px-3 py-1 rounded-full bg-base-800 text-electric-400 border border-electric-500/20">
        Prévu à l'étape : {step}
      </span>
    </div>
  );
}
