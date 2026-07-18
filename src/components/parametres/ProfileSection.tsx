import { useRef, useState, type ChangeEvent } from 'react';
import { User, Upload, Trash2 } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { resizeImageToBase64 } from '@/utils/image';
import { useConfirm } from '@/hooks/useConfirm';

export function ProfileSection() {
  const { get, set, remove, loaded } = useAppSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const { confirm, dialog } = useConfirm();

  const photo = get('profilePhoto');
  const name = get('profileName') ?? '';

  const handleRemovePhoto = async () => {
    if (!(await confirm('Retirer ta photo de profil ?'))) return;
    remove('profilePhoto');
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choisis un fichier image (JPG, PNG...).');
      return;
    }
    try {
      const base64 = await resizeImageToBase64(file);
      await set('profilePhoto', base64);
      setError('');
    } catch {
      setError("Impossible de traiter cette image.");
    }
  };

  if (!loaded) return null;

  return (
    <div className="glass-card p-5">
      {dialog}
      <h3 className="text-sm font-medium text-white mb-1">Profil</h3>
      <p className="text-xs text-muted mb-4">Ta photo et ton nom, affichés dans la sidebar.</p>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-electric-500 shadow-glow flex items-center justify-center overflow-hidden shrink-0">
          {photo ? (
            <img src={photo} alt="Photo de profil" className="w-full h-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-onAccent" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => set('profileName', e.target.value)}
            placeholder="Ton nom"
            className="bg-base-800 border border-base-600 rounded-lg px-3 py-1.5 text-sm text-white focus:border-electric-500 outline-none transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-base-600 text-muted hover:text-white transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              {photo ? 'Changer' : 'Ajouter une photo'}
            </button>
            {photo && (
              <button
                onClick={handleRemovePhoto}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-base-600 text-danger hover:bg-danger/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Retirer
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-danger mt-3">{error}</p>}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}
