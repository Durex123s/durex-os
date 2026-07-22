import type { ElectricalSymbol } from '@/types';

const SYMBOLS: ElectricalSymbol[] = [
  { id: 'disjoncteur', name: 'Disjoncteur', category: 'protection', description: 'Protège le circuit contre les surintensités et court-circuits.' },
  { id: 'fusible', name: 'Fusible', category: 'protection', description: 'Coupe le circuit en cas de surintensité (à usage unique).' },
  { id: 'differentiel', name: 'Différentiel (DDR)', category: 'protection', description: 'Détecte les fuites de courant et protège les personnes.' },
  { id: 'interrupteur', name: 'Interrupteur', category: 'commande', description: 'Ouvre ou ferme manuellement un circuit.' },
  { id: 'bouton-poussoir', name: 'Bouton-poussoir', category: 'commande', description: 'Contact momentané, revient au repos après relâchement.' },
  { id: 'contacteur', name: 'Contacteur', category: 'commande', description: 'Commutateur électromécanique commandé à distance.' },
  { id: 'voltmetre', name: 'Voltmètre', category: 'mesure', description: 'Mesure la tension entre deux points, branché en dérivation.' },
  { id: 'amperemetre', name: 'Ampèremètre', category: 'mesure', description: 'Mesure le courant, branché en série dans le circuit.' },
  { id: 'wattmetre', name: 'Wattmètre', category: 'mesure', description: 'Mesure la puissance active consommée.' },
  { id: 'source-dc', name: 'Source continue', category: 'source', description: 'Générateur de tension continue (pile, batterie).' },
  { id: 'source-ac', name: 'Source alternative', category: 'source', description: 'Générateur de tension alternative sinusoïdale.' },
  { id: 'transformateur', name: 'Transformateur', category: 'source', description: "Modifie le niveau de tension d'un circuit alternatif." },
  { id: 'moteur', name: 'Moteur', category: 'recepteur', description: 'Convertit l\'énergie électrique en énergie mécanique.' },
  { id: 'resistance', name: 'Résistance', category: 'recepteur', description: "S'oppose au passage du courant, dissipe de la chaleur." },
  { id: 'lampe', name: 'Lampe', category: 'recepteur', description: 'Convertit l\'énergie électrique en lumière.' },
];

const CATEGORY_LABELS: Record<ElectricalSymbol['category'], string> = {
  protection: 'Protection',
  commande: 'Commande',
  mesure: 'Mesure',
  source: 'Sources',
  recepteur: 'Récepteurs',
};

// Représentations simplifiées (pas la norme graphique exacte, mais assez
// distinctives pour reconnaître chaque symbole d'un coup d'œil).
function SymbolGlyph({ id }: { id: string }) {
  const stroke = '#22D3EE';
  const common = { stroke, strokeWidth: 1.6, fill: 'none' };
  switch (id) {
    case 'disjoncteur':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><line x1="8" y1="20" x2="16" y2="20" {...common} /><rect x="16" y="12" width="8" height="16" {...common} /><line x1="24" y1="20" x2="32" y2="20" {...common} /></svg>;
    case 'fusible':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><line x1="6" y1="20" x2="12" y2="20" {...common} /><rect x="12" y="14" width="16" height="12" {...common} /><line x1="12" y1="20" x2="28" y2="20" {...common} /><line x1="28" y1="20" x2="34" y2="20" {...common} /></svg>;
    case 'differentiel':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><rect x="10" y="8" width="20" height="24" {...common} /><text x="20" y="24" textAnchor="middle" fontSize="9" fill={stroke}>Id</text></svg>;
    case 'interrupteur':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><line x1="6" y1="26" x2="16" y2="26" {...common} /><line x1="16" y1="26" x2="28" y2="14" {...common} /><line x1="28" y1="26" x2="34" y2="26" {...common} /><circle cx="16" cy="26" r="1.5" fill={stroke} /><circle cx="28" cy="26" r="1.5" fill={stroke} /></svg>;
    case 'bouton-poussoir':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><line x1="8" y1="26" x2="16" y2="26" {...common} /><line x1="16" y1="16" x2="16" y2="26" {...common} /><line x1="24" y1="16" x2="24" y2="26" {...common} /><line x1="24" y1="26" x2="32" y2="26" {...common} /><line x1="20" y1="10" x2="20" y2="16" {...common} /></svg>;
    case 'contacteur':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><rect x="10" y="10" width="20" height="20" {...common} /><line x1="14" y1="20" x2="26" y2="20" {...common} /></svg>;
    case 'voltmetre':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><circle cx="20" cy="20" r="12" {...common} /><text x="20" y="24" textAnchor="middle" fontSize="12" fill={stroke}>V</text></svg>;
    case 'amperemetre':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><circle cx="20" cy="20" r="12" {...common} /><text x="20" y="24" textAnchor="middle" fontSize="12" fill={stroke}>A</text></svg>;
    case 'wattmetre':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><circle cx="20" cy="20" r="12" {...common} /><text x="20" y="24" textAnchor="middle" fontSize="11" fill={stroke}>W</text></svg>;
    case 'source-dc':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><line x1="20" y1="8" x2="20" y2="16" {...common} /><line x1="14" y1="16" x2="26" y2="16" {...common} /><line x1="17" y1="22" x2="23" y2="22" {...common} /><line x1="20" y1="22" x2="20" y2="32" {...common} /></svg>;
    case 'source-ac':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><circle cx="20" cy="20" r="12" {...common} /><path d="M14 20 Q17 14 20 20 T26 20" {...common} /></svg>;
    case 'transformateur':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><circle cx="15" cy="14" r="3" {...common} /><circle cx="15" cy="20" r="3" {...common} /><circle cx="15" cy="26" r="3" {...common} /><circle cx="25" cy="14" r="3" {...common} /><circle cx="25" cy="20" r="3" {...common} /><circle cx="25" cy="26" r="3" {...common} /><line x1="20" y1="10" x2="20" y2="30" {...common} /></svg>;
    case 'moteur':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><circle cx="20" cy="20" r="12" {...common} /><text x="20" y="24" textAnchor="middle" fontSize="12" fill={stroke}>M</text></svg>;
    case 'resistance':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><line x1="4" y1="20" x2="10" y2="20" {...common} /><path d="M10 20 L13 14 L17 26 L21 14 L25 26 L29 14 L32 20" {...common} /><line x1="32" y1="20" x2="36" y2="20" {...common} /></svg>;
    case 'lampe':
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><circle cx="20" cy="20" r="12" {...common} /><line x1="12" y1="12" x2="28" y2="28" {...common} /><line x1="28" y1="12" x2="12" y2="28" {...common} /></svg>;
    default:
      return <svg viewBox="0 0 40 40" className="w-8 h-8"><rect x="10" y="10" width="20" height="20" {...common} /></svg>;
  }
}

export function SymbolLibrary() {
  const categories = Array.from(new Set(SYMBOLS.map((s) => s.category)));

  return (
    <div className="space-y-6">
      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="text-sm font-medium text-muted mb-3">{CATEGORY_LABELS[cat]}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SYMBOLS.filter((s) => s.category === cat).map((s) => (
              <div key={s.id} className="glass-card p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-base-800 flex items-center justify-center shrink-0">
                  <SymbolGlyph id={s.id} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{s.name}</p>
                  <p className="text-xs text-muted mt-0.5">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
