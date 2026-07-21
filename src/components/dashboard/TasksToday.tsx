import { useState } from 'react';
import { WidgetCard } from './WidgetCard';
import { ListChecks, Plus, Trash2 } from 'lucide-react';
import type { Task } from '@/types';
import clsx from 'clsx';
import { useTasks } from '@/hooks/useTasks';
import { useConfirm } from '@/hooks/useConfirm';
import { TaskModal } from './TaskModal';

export function TasksToday() {
  const [modalOpen, setModalOpen] = useState(false);
  const { tasks, addTask, deleteTask, toggleDone } = useTasks();
  const { confirm, dialog } = useConfirm();

  const handleSave = async (task: Task) => {
    await addTask(task);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!(await confirm(`Supprimer la tâche « ${title} » ?`))) return;
    deleteTask(id);
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
      {dialog}
      {tasks.length === 0 ? (
        <p className="text-xs text-muted py-2">Aucune tâche pour l'instant — touche "+" pour en ajouter une.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 group">
              <button
                onClick={() => toggleDone(task.id)}
                className={clsx(
                  'w-4 h-4 rounded-md border shrink-0 transition-colors',
                  task.done ? 'bg-electric-500 border-electric-500' : 'border-base-600 hover:border-electric-400'
                )}
                aria-label={task.done ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
              />
              <span className={clsx('flex-1 text-sm truncate', task.done ? 'line-through text-muted' : 'text-white')}>
                {task.title}
              </span>
              <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', priorityColor[task.priority])} />
              {task.dueTime && <span className="text-xs text-muted tabular-nums shrink-0">{task.dueTime}</span>}
              <button
                onClick={() => handleDelete(task.id, task.title)}
                className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-opacity shrink-0"
                aria-label="Supprimer la tâche"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && <TaskModal onClose={() => setModalOpen(false)} onSave={handleSave} />}
    </WidgetCard>
  );
}
