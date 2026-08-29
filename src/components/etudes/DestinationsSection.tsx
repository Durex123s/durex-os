import { useState } from 'react';
import { Plus, X, Globe2, Trash2 } from 'lucide-react';
import { useDestinations } from '@/hooks/useDestinations';
import { ModalPortal } from '@/components/ui/ModalPortal';

export function DestinationsSection() {
  const { destinations, addDestination, toggleDocument, setLanguageLevel, deleteDestination } = useDestinations();
  const [creating, setCreating] = useState(false);
  const [country, setCountry] = useState('');
  const [priority, setPriority] = useState('1');

  const handleCreate = () => {
    if (!country.trim()) return;
    addDestination(country.trim(), Number(priority) || destinations.length + 1);
    setCountry('');
    setPriority('1');
    setCreating(false);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-electric-400" />
          Destinations d'études
        </h3>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 text-xs text-electric-400 hover:text-electric-500"
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {destinations.map((dest) => (
          <div key={dest.id} className="border border-base-600 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-electric-500/10 text-electric-400 border border-electric-500/30">
                  Priorité {dest.priority}
                </span>
                <strong className="text-sm text-white">{dest.country}</strong>
              </div>
              <button onClick={() => deleteDestination(dest.id)} aria-label="Supprimer">
                <Trash2 className="w-3.5 h-3.5 text-muted hover:text-danger" />
              </button>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted">Niveau de langue</span>
                <span className="text-xs text-muted">{dest.languageLevel}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-base-700 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-electric-500 transition-all duration-500"
                  style={{ width: `${dest.languageLevel}%` }}
                />
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setLanguageLevel(dest.id, dest.languageLevel - 10)}
                  className="flex-1 text-xs py-1 rounded-md border border-base-600 text-muted hover:text-white transition-colors"
                >
                  -10%
                </button>
                <button
                  onClick={() => setLanguageLevel(dest.id, dest.languageLevel + 10)}
                  className="flex-1 text-xs py-1 rounded-md border border-base-600 text-muted hover:text-white transition-colors"
                >
                  +10%
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {dest.documents.map((doc) => (
                <label key={doc.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doc.done}
                    onChange={() => toggleDocument(dest.id, doc.id)}
                    className="w-3.5 h-3.5 rounded accent-electric-500"
                  />
                  <span className={`text-xs ${doc.done ? 'line-through text-muted' : 'text-white'}`}>{doc.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {creating && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setCreating(false)}>
            <div className="glass-card w-full max-w-sm p-6 bg-base-900/95" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-white">Nouvelle destination</h3>
                <button onClick={() => setCreating(false)} className="text-muted hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ex : Canada"
                autoFocus
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-3"
              />
              <label className="text-xs text-muted mb-1 block">Priorité</label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-4"
              />
              <button
                onClick={handleCreate}
                disabled={!country.trim()}
                className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
              >
                Créer
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
