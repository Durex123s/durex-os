import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { CalendarEvent, EventCategory, EventPriority, ReminderOffset } from '@/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, REMINDER_LABELS } from '@/types';
import { format } from 'date-fns';
import { ModalPortal } from '@/components/ui/ModalPortal';

interface EventModalProps {
  initialDate: Date;
  event?: CalendarEvent | null;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as EventCategory[];
const PRIORITIES: EventPriority[] = ['basse', 'normale', 'haute'];
const REMINDER_OPTIONS = Object.keys(REMINDER_LABELS).map(Number) as ReminderOffset[];

function toLocalInput(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function EventModal({ initialDate, event, onClose, onSave, onDelete }: EventModalProps) {
  const defaultStart = new Date(initialDate);
  defaultStart.setMinutes(0, 0, 0);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setHours(defaultEnd.getHours() + 1);

  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [category, setCategory] = useState<EventCategory>(event?.category ?? 'cours');
  const [priority, setPriority] = useState<EventPriority>(event?.priority ?? 'normale');
  const [startTime, setStartTime] = useState(
    toLocalInput(event ? new Date(event.startTime) : defaultStart)
  );
  const [endTime, setEndTime] = useState(toLocalInput(event ? new Date(event.endTime) : defaultEnd));
  const [reminders, setReminders] = useState<ReminderOffset[]>(event?.reminders ?? [30]);

  const toggleReminder = (offset: ReminderOffset) => {
    setReminders((r) => (r.includes(offset) ? r.filter((o) => o !== offset) : [...r, offset]));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const payload: CalendarEvent = {
      id: event?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      color: CATEGORY_COLORS[category],
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      reminders,
    };
    onSave(payload);
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div
          className="glass-card w-full max-w-md p-6 bg-base-900/95 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg font-semibold text-white">
              {event ? "Modifier l'événement" : 'Nouvel événement'}
            </h3>
            <button onClick={onClose} className="text-muted hover:text-white transition-colors" aria-label="Fermer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Titre</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : TP Automatismes"
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted mb-1 block">Début</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-base-800 border border-base-600 rounded-lg px-2 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Fin</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-base-800 border border-base-600 rounded-lg px-2 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted mb-1.5 block">Catégorie</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={clsx(
                      'text-xs px-2.5 py-1.5 rounded-lg border transition-colors',
                      category === c ? 'text-white' : 'text-muted border-base-600 hover:text-white'
                    )}
                    style={
                      category === c
                        ? { backgroundColor: `${CATEGORY_COLORS[c]}33`, borderColor: CATEGORY_COLORS[c] }
                        : undefined
                    }
                  >
                    {CATEGORY_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted mb-1.5 block">Priorité</label>
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={clsx(
                      'flex-1 text-xs py-1.5 rounded-lg border capitalize transition-colors',
                      priority === p
                        ? 'bg-electric-500/20 border-electric-500 text-white'
                        : 'border-base-600 text-muted hover:text-white'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted mb-1.5 block">Rappels</label>
              <div className="flex flex-wrap gap-1.5">
                {REMINDER_OPTIONS.map((offset) => (
                  <button
                    key={offset}
                    onClick={() => toggleReminder(offset)}
                    className={clsx(
                      'text-xs px-2.5 py-1.5 rounded-lg border transition-colors',
                      reminders.includes(offset)
                        ? 'bg-electric-500/20 border-electric-500 text-white'
                        : 'border-base-600 text-muted hover:text-white'
                    )}
                  >
                    {REMINDER_LABELS[offset]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted mb-1 block">Description (optionnel)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            {event && onDelete ? (
              <button
                onClick={() => {
                  onDelete(event.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 text-danger text-sm hover:opacity-80 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button onClick={onClose} className="text-sm px-4 py-2 rounded-lg text-muted hover:text-white transition-colors">
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title.trim()}
                className="text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
