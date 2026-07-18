import { CalendarCheck, PieChart, BookOpen, NotebookPen, ListChecks, Lightbulb, Code2 } from 'lucide-react';

const ACTIONS = [
  { label: 'Planifier ma journée', prompt: 'Planifie ma journée', icon: CalendarCheck },
  { label: 'Analyser mes dépenses', prompt: 'Analyse mes dépenses', icon: PieChart },
  { label: 'Résumer un cours', prompt: 'Résume-moi un cours', icon: BookOpen },
  { label: 'Générer des fiches', prompt: 'Génère-moi des fiches de révision', icon: NotebookPen },
  { label: 'Créer un quiz', prompt: 'Crée-moi un quiz', icon: ListChecks },
  { label: 'Expliquer un exercice', prompt: 'Explique-moi un exercice', icon: Lightbulb },
  { label: 'Aide en programmation', prompt: "J'ai besoin d'aide en programmation", icon: Code2 },
];

export function QuickActions({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => onSelect(action.prompt)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-base-600 text-muted hover:text-white hover:border-electric-500/40 transition-colors"
          >
            <Icon className="w-3.5 h-3.5" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
