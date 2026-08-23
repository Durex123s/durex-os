import { useState } from 'react';
import { Plus, Trash2, X, Rocket } from 'lucide-react';
import { useBusinessIdeas } from '@/hooks/useBusinessIdeas';
import { EmptyState } from '@/components/ui/EmptyState';
import { BUSINESS_STATUS_LABELS, type BusinessStatus } from '@/types';

const STATUS_STYLES: Record<BusinessStatus, string> = {
  idee: 'bg-electric-500/10 text-electric-400 border-electric-500/30',
  test: 'bg-warning/10 text-warning border-warning/30',
  actif: 'bg-success/10 text-success border-success/30',
};

function money(v: number) {
  return `${Math.round(v).toLocaleString('fr-FR')} FCFA`;
}

export function BusinessList() {
  const { ideas, addIdea, deleteIdea } = useBusinessIdeas();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<BusinessStatus>('idee');
  const [clients, setClients] = useState('0');
  const [revenue, setRevenue] = useState('0');

  const handleCreate = () => {
    if (!name.trim()) return;
    addIdea(name.trim(), status, Number(clients) || 0, Number(revenue) || 0);
    setName('');
    setStatus('idee');
    setClients('0');
    setRevenue('0');
    setCreating(false);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Mes idées</h3>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 text-xs text-electric-400 hover:text-electric-500"
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter
        </button>
      </div>

      {ideas.length === 0 && !creating ? (
        <EmptyState
          icon={Rocket}
          title="Aucune idée enregistrée"
          description="Commence par ajouter une idée de business."
        />
      ) : (
        <div className="space-y-2">
          {ideas.map((idea) => (
            <div key={idea.id} className="flex items-center gap-3 border border-base-600 rounded-xl p-3">
              <div className="flex-1 min-w-0">
                <strong className="text-sm text-white truncate block">{idea.name}</strong>
                <p className="text-xs text-muted mt-0.5">
                  {idea.clients} client{idea.clients > 1 ? 's' : ''} · {money(idea.revenue)}
                </p>
              </div>
              <span className={`text-[10px] font-medium px-2 py-1 rounded-full border shrink-0 ${STATUS_STYLES[idea.status]}`}>
                {BUSINESS_STATUS_LABELS[idea.status]}
              </span>
              <button onClick={() => deleteIdea(idea.id)} aria-label="Supprimer" className="shrink-0">
                <Trash2 className="w-3.5 h-3.5 text-muted hover:text-danger" />
              </button>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setCreating(false)}>
          <div className="glass-card w-full max-w-sm p-6 bg-base-900/95 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white">Nouvelle idée</h3>
              <button onClick={() => setCreating(false)} className="text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du business"
              autoFocus
              className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-3"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BusinessStatus)}
              className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white mb-3"
            >
              <option value="idee">Idée</option>
              <option value="test">Test</option>
              <option value="actif">Actif</option>
            </select>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <input
                type="number"
                value={clients}
                onChange={(e) => setClients(e.target.value)}
                placeholder="Clients"
                className="bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white"
              />
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="Revenus FCFA"
                className="bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
