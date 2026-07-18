import { useState } from 'react';
import { Cloud, CloudOff, LogOut, UploadCloud, DownloadCloud, CheckCircle2, Wifi } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { pushBackupToCloud, pullBackupFromCloud } from '@/services/cloudSync';
import { supabaseDebugInfo } from '@/services/supabaseClient';

export function SyncSection() {
  const { user, loading, signUp, signIn, signOut, isConfigured } = useSupabaseAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<'push' | 'pull' | 'auth' | 'test' | null>(null);
  const [testResult, setTestResult] = useState('');
  const [message, setMessage] = useState('');

  const handleTestConnection = async () => {
    setBusy('test');
    setTestResult('');
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/health`, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string },
      });
      const body = await res.text();
      setTestResult(`Statut HTTP ${res.status} — ${body.slice(0, 120)}`);
    } catch (e) {
      const err = e as Error;
      setTestResult(`ÉCHEC — ${err.name}: ${err.message}`);
    } finally {
      setBusy(null);
    }
  };

  const handleAuth = async () => {
    setError('');
    setBusy('auth');
    try {
      if (mode === 'signup') {
        await signUp(email, password);
        setMessage('Compte créé. Vérifie ta boîte mail pour confirmer, puis connecte-toi.');
      } else {
        await signIn(email, password);
      }
    } catch (e) {
      const err = e as Error & { cause?: unknown };
      const detail = [err.name, err.message, err.cause ? String(err.cause) : null].filter(Boolean).join(' — ');
      setError(detail || 'Erreur inconnue.');
    } finally {
      setBusy(null);
    }
  };

  const handlePush = async () => {
    if (!user) return;
    setBusy('push');
    setError('');
    try {
      await pushBackupToCloud(user.id);
      setMessage('Sauvegarde envoyée sur le cloud.');
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec de la sauvegarde.');
    } finally {
      setBusy(null);
    }
  };

  const handlePull = async () => {
    if (!user) return;
    if (!confirm('Ça va remplacer les données locales par celles du cloud. Continuer ?')) return;
    setBusy('pull');
    setError('');
    try {
      const { tablesRestored, updatedAt } = await pullBackupFromCloud(user.id);
      setMessage(
        tablesRestored > 0
          ? `${tablesRestored} table(s) restaurée(s) (sauvegarde du ${new Date(updatedAt!).toLocaleString('fr-FR')}).`
          : "Aucune sauvegarde trouvée sur ce compte pour l'instant."
      );
      setTimeout(() => setMessage(''), 5000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec de la restauration.');
    } finally {
      setBusy(null);
    }
  };

  if (!isConfigured) {
    return (
      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-white mb-1">Synchronisation</h3>
        <div className="flex items-center gap-2 text-sm text-white py-2 opacity-60">
          <CloudOff className="w-4 h-4 text-muted" />
          Sync cloud
        </div>
        <p className="text-[11px] text-muted mt-1">
          Aucun projet Supabase n'est encore relié. Toutes tes données restent en local (hors-ligne) pour l'instant.
        </p>
      </div>
    );
  }

  if (loading) return null;

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-white mb-1">Synchronisation</h3>
      <p className="text-xs text-muted mb-2">
        Un compte te permet de récupérer tes données si tu perds ton téléphone ou en changes.
      </p>
      <p className="text-[10px] text-muted/70 mb-1 font-mono break-all">
        URL complète: {supabaseDebugInfo.urlFull ?? '—'}
      </p>
      <p className="text-[10px] text-muted/70 mb-3 font-mono">
        Longueur URL: {supabaseDebugInfo.urlLength} · Longueur clé: {supabaseDebugInfo.keyLength}
      </p>

      <button
        onClick={handleTestConnection}
        disabled={busy !== null}
        className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-base-600 text-muted hover:text-white disabled:opacity-40 transition-colors mb-3"
      >
        <Wifi className="w-3.5 h-3.5" />
        {busy === 'test' ? 'Test en cours…' : 'Tester la connexion à Supabase'}
      </button>
      {testResult && (
        <p className={`text-[11px] mb-3 font-mono break-words ${testResult.startsWith('ÉCHEC') ? 'text-danger' : 'text-success'}`}>
          {testResult}
        </p>
      )}

      {!user ? (
        <>
          <div className="flex gap-2 mb-3 text-xs">
            <button
              onClick={() => setMode('signin')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${mode === 'signin' ? 'border-electric-500/50 bg-electric-500/10 text-electric-400' : 'border-base-600 text-muted'}`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${mode === 'signup' ? 'border-electric-500/50 bg-electric-500/10 text-electric-400' : 'border-base-600 text-muted'}`}
            >
              Créer un compte
            </button>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe (6 caractères min.)"
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-3"
          />
          {error && <p className="text-xs text-danger mb-2">{error}</p>}
          {message && <p className="text-xs text-success mb-2">{message}</p>}
          <button
            onClick={handleAuth}
            disabled={busy === 'auth' || !email || password.length < 6}
            className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 text-onAccent font-medium transition-colors"
          >
            {busy === 'auth' ? 'Patiente…' : mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-white">
              <Cloud className="w-4 h-4 text-success" />
              {user.email}
            </div>
            <button onClick={signOut} className="flex items-center gap-1 text-xs text-muted hover:text-danger transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={handlePush}
              disabled={busy !== null}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 text-onAccent font-medium transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {busy === 'push' ? 'Envoi…' : 'Sauvegarder maintenant'}
            </button>
            <button
              onClick={handlePull}
              disabled={busy !== null}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-base-600 text-muted hover:text-white disabled:opacity-40 transition-colors"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              {busy === 'pull' ? 'Restauration…' : 'Restaurer depuis le cloud'}
            </button>
          </div>

          {error && <p className="text-xs text-danger mt-3">{error}</p>}
          {message && (
            <div className="flex items-center gap-2 text-xs text-success mt-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {message}
            </div>
          )}
          <p className="text-[11px] text-muted mt-3">
            Pense à sauvegarder après des changements importants. Si tu perds ton téléphone, reconnecte-toi
            avec ce même compte sur la nouvelle installation puis restaure.
          </p>
        </>
      )}
    </div>
  );
}
