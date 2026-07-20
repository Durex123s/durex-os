// Types du domaine — partagés par tous les modules (web + futur Expo)

export type ModuleId =
  | 'dashboard'
  | 'planning'
  | 'etudes'
  | 'finances'
  | 'discipline'
  | 'outils'
  | 'dev'
  | 'assistant'
  | 'objectifs'
  | 'analytics'
  | 'fichiers'
  | 'parametres';

export interface NavItem {
  id: ModuleId;
  label: string;
  path: string;
  icon: string; // nom d'icône lucide-react
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  dueTime?: string; // "HH:mm"
  priority: 'basse' | 'normale' | 'haute';
}

export type EventCategory = 'cours' | 'rdv' | 'examen' | 'travail' | 'evenement';
export type EventPriority = 'basse' | 'normale' | 'haute';
export type ReminderOffset = 1440 | 60 | 30 | 10; // minutes avant : 1j / 1h / 30min / 10min

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  cours: 'Cours',
  rdv: 'Rendez-vous',
  examen: 'Examen',
  travail: 'Travail',
  evenement: 'Événement',
};

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  cours: '#C9A227',
  rdv: '#D99A3D',
  examen: '#C0435B',
  travail: '#3FAE68',
  evenement: '#4E8C82',
};

export const REMINDER_LABELS: Record<ReminderOffset, string> = {
  1440: '1 jour avant',
  60: '1 heure avant',
  30: '30 minutes avant',
  10: '10 minutes avant',
};

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  priority: EventPriority;
  color: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  reminders: ReminderOffset[];
}

// ---------------------------------------------------------------------------
// Module Études
// ---------------------------------------------------------------------------

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string; // nom d'icône lucide-react
  pinned?: boolean; // ex : GEII épinglée en haut
}

export type ResourceType = 'note' | 'cours' | 'pdf' | 'video' | 'exercice' | 'devoir' | 'examen';

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  note: 'Notes',
  cours: 'Cours',
  pdf: 'PDF',
  video: 'Vidéos',
  exercice: 'Exercices',
  devoir: 'Devoirs',
  examen: 'Examens',
};

export interface StudyResource {
  id: string;
  subjectId: string;
  type: ResourceType;
  title: string;
  content?: string; // texte libre pour notes/cours
  url?: string; // lien externe pour pdf/vidéo
  done: boolean; // pour exercices/devoirs : fait ou non
  dueDate?: string; // ISO — pour devoirs/examens
  createdAt: string; // ISO
}

export interface Flashcard {
  id: string;
  subjectId: string;
  question: string;
  answer: string;
  /** Répétition espacée (SM-2 simplifié) — undefined = jamais révisée, à réviser en priorité. */
  dueDate?: string; // ISO — prochaine date de révision prévue
  interval?: number; // jours avant la prochaine révision
  easeFactor?: number; // facilité mémorisée (défaut 2.5)
  repetitions?: number; // nombre de révisions réussies d'affilée
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  subjectId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number; // sur 100
  completedAt: string; // ISO
}

// ---------------------------------------------------------------------------
// Module Finances
// ---------------------------------------------------------------------------

export type TransactionType = 'revenu' | 'depense';

export const DEFAULT_EXPENSE_CATEGORIES = ['Nourriture', 'Transport', 'Logement', 'Loisirs', 'Études', 'Santé', 'Autre'];
export const DEFAULT_INCOME_CATEGORIES = ['Salaire', 'Bourse', 'Aide familiale', 'Freelance', 'Autre'];

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // en FCFA
  category: string;
  note?: string;
  date: string; // ISO
}

export interface SavingsGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  createdAt: string; // ISO
}

export type BudgetPeriod = 'jour' | 'semaine' | 'mois';

export interface CategoryBudget {
  id: string;
  category: string;
  limit: number; // FCFA
  period: BudgetPeriod;
}

// ---------------------------------------------------------------------------
// Module Discipline
// ---------------------------------------------------------------------------

export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string; // nom d'icône lucide-react
  completedDates: string[]; // dates ISO (jour seulement, "yyyy-MM-dd")
  reminderTime?: string; // "HH:mm", rappel quotidien optionnel
}

export type PomodoroType = 'etude' | 'travail' | 'repos';

export interface PomodoroSession {
  id: string;
  type: PomodoroType;
  durationMinutes: number;
  completedAt: string; // ISO
}

// ---------------------------------------------------------------------------
// Module Outils électricien
// ---------------------------------------------------------------------------

export type CalculatorId =
  | 'ohm'
  | 'puissance'
  | 'chute-tension'
  | 'section-cable'
  | 'disjoncteur'
  | 'facteur-puissance'
  | 'climatisation'
  | 'conversion';

export interface ElectricalSymbol {
  id: string;
  name: string;
  category: 'protection' | 'commande' | 'mesure' | 'source' | 'recepteur';
  description: string;
}

// ---------------------------------------------------------------------------
// Module Objectifs
// ---------------------------------------------------------------------------

// "cumulatif" = la progression s'accumule dans le temps (ex : épargner 500 000 FCFA).
// "quotidien" = la progression repart de zéro chaque jour (ex : réviser 3h/jour).
export type GoalMode = 'cumulatif' | 'quotidien';

// Certains objectifs peuvent être suivis automatiquement à partir d'autres
// modules (épargne -> Finances, étude/travail -> Pomodoro). Sinon, suivi manuel.
export type GoalAutoSource = 'epargne' | 'pomodoro_etude' | 'pomodoro_travail' | null;

export interface AppGoal {
  id: string;
  title: string;
  unit: string;
  target: number;
  mode: GoalMode;
  autoSource: GoalAutoSource;
  manualLog: Record<string, number>; // clé = date ISO (quotidien) ou "total" (cumulatif)
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Module Assistant IA
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Notifications intelligentes
// ---------------------------------------------------------------------------

export interface SmartNotification {
  id: string;
  message: string;
  level: 'info' | 'warning';
}

// ---------------------------------------------------------------------------
// Module Espace développeur
// ---------------------------------------------------------------------------

export type ProjectStatus = 'idee' | 'en-cours' | 'termine';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface DevProject {
  id: string;
  name: string;
  status: ProjectStatus;
  githubUrl?: string;
  notes?: string;
  checklist: ChecklistItem[];
  createdAt: string;
}

export interface DevSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
}

export interface DevIdea {
  id: string;
  title: string;
  note?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Module Paramètres
// ---------------------------------------------------------------------------

export interface AppSettings {
  key: string; // clé unique, ex: "lockPin", "biometricEnabled", "supabaseSyncEnabled"
  value: string;
}

export type AttachmentKind = 'docx' | 'pdf' | 'xlsx' | 'csv' | 'other';

export interface Attachment {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  kind: AttachmentKind;
  /** Si défini, ce fichier est rattaché à une matière (Études) plutôt que d'être un import général. */
  subjectId?: string;
  /** Texte extrait pour docx/pdf (aperçu + recherche). */
  textContent?: string;
  /** Lignes extraites pour xlsx/csv (tableau simple, 1ère ligne = en-têtes). */
  rows?: string[][];
  /** Fichier original conservé pour téléchargement / réouverture. */
  blob: Blob;
  createdAt: string;
}

export interface DashboardWidgetConfig {
  id: string;
  visible: boolean;
  order: number;
}
