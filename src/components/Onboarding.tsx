import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, BookOpen, Wallet, Flame, Search, ArrowRight, X,
} from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

interface Slide {
  icon: typeof LayoutDashboard;
  title: string;
  text: string;
}

const SLIDES: Slide[] = [
  {
    icon: LayoutDashboard,
    title: 'Ton tableau de bord',
    text: "Tâches, objectifs, finances, discipline : tout en un coup d'œil. Réorganise les widgets dans Paramètres.",
  },
  {
    icon: BookOpen,
    title: 'Études',
    text: 'Crée tes matières, importe tes PDF et Word de cours directement dedans, fais des fiches et des quiz.',
  },
  {
    icon: Wallet,
    title: 'Finances',
    text: 'Suis tes revenus et dépenses, fixe des objectifs d\'épargne, exporte un rapport PDF complet à tout moment.',
  },
  {
    icon: Flame,
    title: 'Discipline',
    text: 'Minuteur Pomodoro, habitudes quotidiennes — construis ta régularité jour après jour.',
  },
  {
    icon: Search,
    title: 'Recherche globale',
    text: 'La loupe en haut de l\'écran retrouve une tâche, un fichier ou une transaction en un instant, où que tu sois.',
  },
];

export function Onboarding({ children }: { children: ReactNode }) {
  const { get, set, loaded } = useAppSettings();
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const done = get('onboardingDone') === 'true';

  const finish = async () => {
    setDismissed(true);
    await set('onboardingDone', 'true');
  };

  if (!loaded || done || dismissed) return <>{children}</>;

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-[95] bg-base-950 flex flex-col items-center justify-center p-6">
      <button
        onClick={finish}
        className="absolute top-5 right-5 text-muted hover:text-white transition-colors text-xs flex items-center gap-1"
      >
        Passer <X className="w-3.5 h-3.5" />
      </button>

      <div className="w-full max-w-xs text-center">
        <div className="w-16 h-16 rounded-2xl bg-electric-500/10 border border-electric-500/30 flex items-center justify-center mx-auto mb-6">
          <slide.icon className="w-7 h-7 text-electric-400" />
        </div>
        <h2 className="font-display text-xl font-semibold text-white mb-2">{slide.title}</h2>
        <p className="text-sm text-muted leading-relaxed">{slide.text}</p>

        <div className="flex items-center justify-center gap-1.5 mt-8 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-5 bg-electric-500' : 'w-1.5 bg-base-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-onAccent bg-electric-500 hover:bg-electric-600 rounded-lg py-2.5 transition-colors"
        >
          {isLast ? 'Commencer' : 'Suivant'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
