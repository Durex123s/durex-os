import { Link } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Palette, Search, LayoutDashboard, BookOpen, FileText,
  Bell, ShieldCheck, Trash2, CloudCog, Rocket,
} from 'lucide-react';

interface ChangeItem {
  icon: typeof Sparkles;
  title: string;
  description: string;
}

const CHANGES: ChangeItem[] = [
  {
    icon: Palette,
    title: 'Nouvelle identité visuelle',
    description:
      "Charbon profond et accents laiton/platine, typographie Fraunces pour les titres — Veyrion a maintenant son propre style, avec une couleur d'accent personnalisable.",
  },
  {
    icon: Sparkles,
    title: 'Écran de bienvenue et tour de démarrage',
    description:
      "Un accueil personnalisé (photo, nom, message selon l'heure) à chaque ouverture, et un court tour guidé la toute première fois.",
  },
  {
    icon: Search,
    title: 'Recherche globale',
    description:
      "La loupe en haut de l'écran retrouve une tâche, un cours, une transaction ou un fichier en un instant, où que tu sois dans l'app.",
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard personnalisable',
    description: "Les widgets du tableau de bord se réorganisent maintenant à ta guise, en plus d'être activables/désactivables.",
  },
  {
    icon: BookOpen,
    title: 'Import de documents dans Études',
    description:
      "Chaque matière a son propre espace Fichiers pour importer PDF et Word de cours, avec aperçu du contenu directement dans l'app.",
  },
  {
    icon: FileText,
    title: 'Rapport PDF enrichi',
    description:
      "L'export PDF inclut maintenant une vue d'ensemble numérique (tous domaines confondus) et une vue analytique avec tendances sur 30 jours.",
  },
  {
    icon: Bell,
    title: 'Notifications intelligentes',
    description:
      "Une notification t'informe quand une mise à jour est disponible, et toutes les notifications ouvrent directement la bonne section au lieu du tableau de bord.",
  },
  {
    icon: Trash2,
    title: 'Confirmation avant suppression',
    description:
      "Toutes les actions destructives (tâches, transactions, habitudes, fichiers...) demandent maintenant confirmation avant d'agir.",
  },
  {
    icon: CloudCog,
    title: 'Synchronisation cloud améliorée',
    description:
      "Tes fichiers importés se synchronisent maintenant aussi entre appareils, dans un espace de stockage dédié et sécurisé.",
  },
  {
    icon: ShieldCheck,
    title: 'Sécurité renforcée',
    description: "La clé de signature de l'app a été régénérée et sécurisée — plus aucun secret n'est stocké dans le code source.",
  },
];

export function Nouveautes() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/parametres" className="text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-electric-400" />
            Nouveautés
          </h1>
          <p className="text-muted text-sm mt-1">Version 2.0 — ce qui a changé depuis la dernière mise à jour majeure.</p>
        </div>
      </div>

      <div className="space-y-3">
        {CHANGES.map((item) => (
          <div key={item.title} className="glass-card p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-electric-500/10 border border-electric-500/30 flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-electric-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted/60 pt-2">Veyrion v2.0</p>
    </div>
  );
}
