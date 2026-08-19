import { SkillsList } from '@/components/competences/SkillsList';
import { useSkills } from '@/hooks/useSkills';

export function Competences() {
  const { averageLevel } = useSkills();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Compétences</h1>
          <p className="text-muted text-sm mt-1">Construire une compétence monétisable.</p>
        </div>
        <div className="glass-card px-4 py-2.5 text-right">
          <p className="text-[10px] text-muted">Niveau moyen</p>
          <p className="font-display text-lg font-semibold text-white">{averageLevel.toFixed(1)}/10</p>
        </div>
      </div>

      <SkillsList />
    </div>
  );
}
