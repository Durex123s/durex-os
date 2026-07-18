import { useState } from 'react';
import { Plus, X, Trash2, Copy, Check } from 'lucide-react';
import { useDevSnippets } from '@/hooks/useDevSpace';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { useConfirm } from '@/hooks/useConfirm';

const LANGUAGES = ['TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS', 'SQL', 'Autre'];

export function SnippetsSection() {
  const { snippets, addSnippet, deleteSnippet } = useDevSnippets();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { confirm, dialog } = useConfirm();

  const handleDelete = async (id: string) => {
    if (!(await confirm('Supprimer ce snippet ?'))) return;
    deleteSnippet(id);
  };

  const handleCreate = () => {
    if (!title.trim() || !code.trim()) return;
    addSnippet({ title: title.trim(), language, code });
    setTitle('');
    setCode('');
    setCreating(false);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Presse-papiers indisponible (permissions navigateur) — on ignore silencieusement.
    }
  };

  return (
    <div className="space-y-4">
      {dialog}
      <div className="flex justify-end">
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 bg-electric-500 hover:bg-electric-600 text-onAccent font-medium text-sm px-3 py-1.5 rounded-lg transition-colors shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Nouveau snippet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {snippets.map((s) => (
          <div key={s.id} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-white">{s.title}</p>
                <span className="text-[10px] text-muted">{s.language}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleCopy(s.id, s.code)} className="text-muted hover:text-electric-400 transition-colors" aria-label="Copier">
                  {copiedId === s.id ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => handleDelete(s.id)} className="text-muted hover:text-danger transition-colors" aria-label="Supprimer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <pre className="bg-base-950 border border-base-700 rounded-lg p-3 text-xs text-electric-300 overflow-x-auto font-mono max-h-48">
              {s.code}
            </pre>
          </div>
        ))}
      </div>

      {creating && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setCreating(false)}>
            <div className="glass-card w-full max-w-lg p-6 bg-base-900/95 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-white">Nouveau snippet</h3>
                <button onClick={() => setCreating(false)} className="text-muted hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre"
                autoFocus
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-3"
              />
              <div className="flex flex-wrap gap-1.5 mb-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                      language === l ? 'bg-electric-500/20 border-electric-500 text-white' : 'border-base-600 text-muted'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Colle ton code ici..."
                rows={8}
                className="w-full bg-base-950 border border-base-600 rounded-lg px-3 py-2 text-xs text-electric-300 font-mono focus:border-electric-500 outline-none transition-colors resize-none mb-5"
              />
              <button
                onClick={handleCreate}
                disabled={!title.trim() || !code.trim()}
                className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
