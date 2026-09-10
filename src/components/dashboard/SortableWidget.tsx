import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableWidgetProps {
  id: string;
  children: ReactNode;
}

// Enveloppe un widget du dashboard pour le rendre réordonnable par glisser-déposer.
// Seule la poignée (petit cercle en haut à droite, légèrement en dehors de la
// carte) déclenche le drag, pour ne jamais gêner les boutons internes du widget.
export function SortableWidget({ id, children }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        {...attributes}
        {...listeners}
        aria-label="Réorganiser ce widget"
        className="absolute -top-2 -right-2 z-20 p-1.5 rounded-full bg-base-800 border border-base-600 text-muted hover:text-white hover:border-white/30 shadow-card transition-colors cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>
      {children}
    </div>
  );
}
