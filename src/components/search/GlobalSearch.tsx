import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, X, ListChecks, BookOpen, Wallet, FileText, Layers, Code2, Flame, Target } from 'lucide-react';
import { db } from '@/database/db';

interface ResultItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: typeof Search;
  onSelect: () => void;
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const resources = useLiveQuery(() => db.resources.toArray(), []) ?? [];
  const subjects = useLiveQuery(() => db.subjects.toArray(), []) ?? [];
  const transactions = useLiveQuery(() => db.transactions.toArray(), []) ?? [];
  const attachments = useLiveQuery(() => db.attachments.toArray(), []) ?? [];
  const devProjects = useLiveQuery(() => db.devProjects.toArray(), []) ?? [];
  const habits = useLiveQuery(() => db.habits.toArray(), []) ?? [];
  const goals = useLiveQuery(() => db.goals.toArray(), []) ?? [];

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const results = useMemo<{ category: string; items: ResultItem[] }[]>(() => {
    const q = norm(query.trim());
    if (q.length < 2) return [];

    const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name;

    const groups: { category: string; items: ResultItem[] }[] = [
      {
        category: 'Tâches',
        items: tasks
          .filter((t) => norm(t.title).includes(q))
          .slice(0, 5)
          .map((t) => ({
            id: t.id,
            label: t.title,
            sublabel: t.done ? 'Terminée' : t.dueTime ?? 'À faire',
            icon: ListChecks,
            onSelect: () => navigate('/planning'),
          })),
      },
      {
        category: 'Études — ressources',
        items: resources
          .filter((r) => norm(r.title).includes(q))
          .slice(0, 5)
          .map((r) => ({
            id: r.id,
            label: r.title,
            sublabel: subjectName(r.subjectId),
            icon: BookOpen,
            onSelect: () => navigate(`/etudes/${r.subjectId}`),
          })),
      },
      {
        category: 'Matières',
        items: subjects
          .filter((s) => norm(s.name).includes(q))
          .slice(0, 5)
          .map((s) => ({
            id: s.id,
            label: s.name,
            icon: Layers,
            onSelect: () => navigate(`/etudes/${s.id}`),
          })),
      },
      {
        category: 'Finances',
        items: transactions
          .filter((t) => norm(t.category).includes(q) || norm(t.note ?? '').includes(q))
          .slice(0, 5)
          .map((t) => ({
            id: t.id,
            label: t.note?.trim() ? t.note : t.category,
            sublabel: `${t.type === 'revenu' ? '+' : '-'}${t.amount} FCFA`,
            icon: Wallet,
            onSelect: () => navigate('/finances'),
          })),
      },
      {
        category: 'Fichiers',
        items: attachments
          .filter((a) => norm(a.fileName).includes(q))
          .slice(0, 5)
          .map((a) => ({
            id: a.id,
            label: a.fileName,
            sublabel: a.subjectId ? subjectName(a.subjectId) : 'Fichier général',
            icon: FileText,
            onSelect: () => navigate(a.subjectId ? `/etudes/${a.subjectId}` : '/fichiers'),
          })),
      },
      {
        category: 'Projets dev',
        items: devProjects
          .filter((p) => norm(p.name).includes(q))
          .slice(0, 5)
          .map((p) => ({
            id: p.id,
            label: p.name,
            sublabel: p.status,
            icon: Code2,
            onSelect: () => navigate('/dev'),
          })),
      },
      {
        category: 'Habitudes',
        items: habits
          .filter((h) => norm(h.name).includes(q))
          .slice(0, 5)
          .map((h) => ({
            id: h.id,
            label: h.name,
            icon: Flame,
            onSelect: () => navigate('/discipline'),
          })),
      },
      {
        category: 'Objectifs',
        items: goals
          .filter((g) => norm(g.title).includes(q))
          .slice(0, 5)
          .map((g) => ({
            id: g.id,
            label: g.title,
            icon: Target,
            onSelect: () => navigate('/objectifs'),
          })),
      },
    ];

    return groups.filter((g) => g.items.length > 0);
  }, [query, tasks, resources, subjects, transactions, attachments, devProjects, habits, goals, navigate]);

  const totalResults = results.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 rounded-xl border border-base-600 text-muted hover:text-white hover:border-electric-500/40 transition-colors flex items-center justify-center shrink-0"
        aria-label="Rechercher"
      >
        <Search className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24"
          onClick={close}
        >
          <div
            className="glass-card w-full max-w-lg bg-base-900/95 max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 p-4 border-b border-base-600">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une tâche, un cours, une transaction..."
                className="bg-transparent flex-1 text-sm text-white placeholder:text-muted/60 outline-none"
              />
              <button onClick={close} className="text-muted hover:text-white transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-2">
              {query.trim().length < 2 && (
                <p className="text-xs text-muted text-center py-8">Tape au moins 2 caractères pour chercher.</p>
              )}
              {query.trim().length >= 2 && totalResults === 0 && (
                <p className="text-xs text-muted text-center py-8">Aucun résultat pour « {query} ».</p>
              )}
              {results.map((group) => (
                <div key={group.category} className="mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted/70 px-2 py-1.5">
                    {group.category}
                  </p>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.onSelect();
                        close();
                      }}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-electric-500/10 border border-electric-500/25 flex items-center justify-center shrink-0">
                        <item.icon className="w-3.5 h-3.5 text-electric-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{item.label}</p>
                        {item.sublabel && <p className="text-xs text-muted truncate">{item.sublabel}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
