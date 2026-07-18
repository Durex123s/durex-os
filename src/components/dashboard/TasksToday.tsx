import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { WidgetCard } from './WidgetCard';
import { ListChecks, Plus } from 'lucide-react';
import type { Task } from '@/types';
import clsx from 'clsx';
import { db } from '@/database/db';
import { TaskModal } from './TaskModal';

export function TasksToday() {
  const [modalOpen, setModalOpen] = useState(false);
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];

  const toggle = (id: string, done: boolean) => {
    db.tasks.update(id, { done: !done });
  };

  const handleSave = async (task: Task) => {
    await db.tasks.add(task);
  };

  const priorityColor = {
    haute: 'bg-danger',
    normale: 'bg-warning',
    basse: 'bg-muted',
  } as const;

  return (
    <WidgetCard
      title="Tâches du jour"
      icon={<ListChecks className="w-4 h-4" />}
      action={
        <button
          onClick={() => setModalOpen(true)}
          className="text-muted hover:text-electric-400 transition-colors"
          aria-label="Ajouter une tâche"
        >
          <Plus className="w-4 h-4" />
        </button>
      }
    >
      {tasks.length === 0 ? (
        <p className="text-xs text-muted py-2">Aucune tâche pour l'instant — touche "+" pour en ajouter une.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 group">
              <button
                onClick={() => toggle(task.id, task.done)}
                className={clsx(
                  'w-4 h-4 rounded-md border shrink-0 transition-colors',
                  task.done ? 'bg-electric-500 border-electric-500' : 'border-base-600 hover:border-electric-400'
                )}
                aria-label={task.done ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
              />
              <span className={clsx('flex-1 text-sm', task.done ? 'line-through text-muted' : 'text-white')}>
                {task.title}
              </span>
              <span className={clsx('w-1.5 h-1.5 rounded-full', priorityColor[task.priority])} />
              {task.dueTime && <span className="text-xs text-muted tabular-nums">{task.dueTime}</span>}
            </li>
          ))}
        </ul>
      )}

      {modalOpen && <TaskModal onClose={() => setModalOpen(false)} onSave={handleSave} />}
    </WidgetCard>
  );
}
