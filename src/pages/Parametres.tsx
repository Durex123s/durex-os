import { ProfileSection } from '@/components/parametres/ProfileSection';
import { ThemeSection } from '@/components/parametres/ThemeSection';
import { AccentColorSection } from '@/components/parametres/AccentColorSection';
import { TypographySection } from '@/components/parametres/TypographySection';
import { SavingsPercentSection } from '@/components/parametres/SavingsPercentSection';
import { AvatarCustomSection } from '@/components/parametres/AvatarCustomSection';
import { BackupSection } from '@/components/parametres/BackupSection';
import { PersonalizationSection } from '@/components/parametres/PersonalizationSection';
import { SecuritySection } from '@/components/parametres/SecuritySection';
import { SyncSection } from '@/components/parametres/SyncSection';

export function Parametres() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Paramètres</h1>
        <p className="text-muted text-sm mt-1">Profil, sauvegarde, personnalisation, sécurité et synchronisation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ProfileSection />
        <ThemeSection />
        <AccentColorSection />
        <TypographySection />
        <SavingsPercentSection />
        <AvatarCustomSection />
        <BackupSection />
        <PersonalizationSection />
        <SecuritySection />
        <SyncSection />
      </div>
    </div>
  );
}
