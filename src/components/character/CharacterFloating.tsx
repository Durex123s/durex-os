import { DynamicCharacter } from './DynamicCharacter';

// Petit personnage flottant, visible sur toutes les pages, en bas à droite.
// Sur mobile, remonté au-dessus de la nav basse (~64px) + zone de sécurité ;
// sur desktop (pas de nav basse), reste simplement collé au coin.
// z-40 : sous les modales et le bandeau de mise à jour (z-50).
export function CharacterFloating() {
  return (
    <div
      className="fixed z-40 pointer-events-none right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-6"
    >
      <div className="pointer-events-auto drop-shadow-lg">
        <DynamicCharacter size={52} />
      </div>
    </div>
  );
}
