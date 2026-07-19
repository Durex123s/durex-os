import { Link } from 'react-router-dom';
import { Rocket, ChevronRight } from 'lucide-react';
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

      <Link to="/nouveautes" className="glass-card p-4 flex items-center gap-3 hover:border-electric-500/30 transition-colors">
        <div className="w-9 h-9 rounded-lg bg-electric-500/10 border border-electric-500/30 flex items-center justify-center shrink-0">
          <Rocket className="w-4 h-4 text-electric-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">Veyrion v2.0</p>
          <p className="text-xs text-muted">Voir ce qui a changé dans cette mise à jour</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted shrink-0" />
      </Link>

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
