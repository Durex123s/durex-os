import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Trash2, Flame, Clock, Trophy } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { computeBestStreak } from '@/utils/discipline';
import { useConfirm } from '@/hooks/useConfirm';

const COLOR_CHOICES = ['#22D3EE', '#34D399', '#FBBF24', '#F43F5E', '#A855F7'];

export function HabitList() {
  const { habits, addHabit, deleteHabit, toggleToday, setReminder } = useHabits();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_CHOICES[0]);
  const [reminderTime, setReminderTime] = useState('');
  const [editingReminder, setEditingReminder] = useState<string | null>(null);
  const [editTime, setEditTime] = useState('');
  const { confirm, dialog } = useConfirm();

  const handleDelete = async (id: string, habitName: string) => {
    if (!(await confirm(`Supprimer « ${habitName} » ? Tout son historique de séries sera perdu.`))) return;
    deleteHabit(id);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    addHabit({
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      icon: 'Circle',
      completedDates: [],
      reminderTime: reminderTime || undefined,
    });
    setName('');
    setReminderTime('');
    setCreating(false);
  };

  const startEditReminder = (id: string, current?: string) => {
    setEditingReminder(id);
    setEditTime(current ?? '');
  };

  const saveReminder = (id: string, value: string) => {
    setReminder(id, value || undefined);
    setEditingReminder(null);
  };

  return (
    <div className="glass-card p-5">
      {dialog}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted">Habitudes</h3>
        <button onClick={() => setCreating(true)} className="text-muted hover:text-electric-400 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <ul className="space-y-2">
        {habits.length === 0 && (
          <p className="text-sm text-muted text-center py-6">
            Aucune habitude suivie — touche "+" pour construire ta régularité jour après jour.
          </p>
        )}
        {habits.map((h) => {
          const best = computeBestStreak(h.completedDates);
          return (
          <li key={h.id} className="flex flex-col gap-1.5 group">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleToday(h.id)}
                className="w-5 h-5 rounded-md border shrink-0 transition-colors"
                style={h.doneToday ? { backgroundColor: h.color, borderColor: h.color } : { borderColor: '#2A2A38' }}
                aria-label="Cocher aujourd'hui"
              />
              <span className={`flex-1 text-sm ${h.doneToday ? 'text-white' : 'text-muted'}`}>{h.name}</span>
              {h.streak > 0 && (
                <span className="flex items-center gap-1 text-xs text-warning">
                  <Flame className="w-3 h-3" />
                  {h.streak}
                </span>
              )}
                {best > h.streak && (
                  <span className="flex items-center gap-1 text-xs text-muted" title="Meilleur streak jamais atteint">
                    <Trophy className="w-3 h-3" />
                    {best}
                  </span>
                )}
              <button
                onClick={() => startEditReminder(h.id, h.reminderTime)}
                className={`transition-colors ${h.reminderTime ? 'text-electric-400' : 'text-muted opacity-40 group-hover:opacity-100 hover:text-electric-400'}`}
                aria-label="Régler un rappel"
              >
                <Clock className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(h.id, h.name)}
                className="opacity-40 group-hover:opacity-100 text-muted hover:text-danger transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {editingReminder === h.id && (
              <div className="flex items-center gap-2 pl-8">
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="bg-base-800 border border-base-600 rounded-lg px-2 py-1 text-xs text-white focus:border-electric-500 outline-none transition-colors"
                />
                <button onClick={() => saveReminder(h.id, editTime)} className="text-xs text-electric-400 hover:underline">
                  Enregistrer
                </button>
                {h.reminderTime && (
                  <button onClick={() => saveReminder(h.id, '')} className="text-xs text-muted hover:text-danger">
                    Retirer
                  </button>
                )}
              </div>
            )}
          </li>
          );
        })}
      </ul>

      {creating && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setCreating(false)}>
          <div className="glass-card w-full max-w-sm p-6 bg-base-900/95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white">Nouvelle habitude</h3>
              <button onClick={() => setCreating(false)} className="text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Lire 20 minutes"
              autoFocus
              className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-4"
            />
            <div className="flex flex-wrap gap-1.5 mb-4">
              {COLOR_CHOICES.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-transform"
                  style={{ backgroundColor: c, borderColor: color === c ? '#fff' : 'transparent' }}
                />
              ))}
            </div>
            <label className="text-xs text-muted mb-1 block">Rappel quotidien (optionnel)</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-5"
            />
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
            >
              Créer
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
