import Dexie, { type Table } from 'dexie';
import type {
  CalendarEvent,
  Task,
  Subject,
  StudyResource,
  Flashcard,
  Quiz,
  QuizAttempt,
  Transaction,
  SavingsGoal,
  CategoryBudget,
  Habit,
  PomodoroSession,
  AppGoal,
  ChatMessage,
  DevProject,
  DevSnippet,
  DevIdea,
  AppSettings,
  Attachment,
} from '@/types';
import type { AIMemory } from '@/ai/types';

// Base locale hors-ligne (IndexedDB via Dexie). C'est la source de vérité
// sur l'appareil ; la synchronisation Supabase (étape 7) viendra pousser/tirer
// ces mêmes tables sans changer ce schéma.
export class VeyrionDB extends Dexie {
  events!: Table<CalendarEvent, string>;
  tasks!: Table<Task, string>;
  subjects!: Table<Subject, string>;
  resources!: Table<StudyResource, string>;
  flashcards!: Table<Flashcard, string>;
  quizzes!: Table<Quiz, string>;
  quizAttempts!: Table<QuizAttempt, string>;
  transactions!: Table<Transaction, string>;
  savingsGoals!: Table<SavingsGoal, string>;
  categoryBudgets!: Table<CategoryBudget, string>;
  habits!: Table<Habit, string>;
  pomodoroSessions!: Table<PomodoroSession, string>;
  aiMemory!: Table<AIMemory, string>;
  goals!: Table<AppGoal, string>;
  chatMessages!: Table<ChatMessage, string>;
  devProjects!: Table<DevProject, string>;
  devSnippets!: Table<DevSnippet, string>;
  devIdeas!: Table<DevIdea, string>;
  settings!: Table<AppSettings, string>;
  attachments!: Table<Attachment, string>;

  constructor() {
    super('veyrion');
    this.version(1).stores({
      events: 'id, startTime, category',
      tasks: 'id, dueTime, done',
    });
    this.version(2).stores({
      subjects: 'id, name',
      resources: 'id, subjectId, type, done',
      flashcards: 'id, subjectId',
      quizzes: 'id, subjectId',
      quizAttempts: 'id, quizId, completedAt',
    });
    this.version(3).stores({
      transactions: 'id, type, category, date',
      savingsGoals: 'id, createdAt',
      habits: 'id, name',
      pomodoroSessions: 'id, type, completedAt',
    });
    this.version(4).stores({
      goals: 'id, mode, createdAt',
    });
    this.version(5).stores({
      chatMessages: 'id, createdAt',
    });
    this.version(6).stores({
      devProjects: 'id, status, createdAt',
      devSnippets: 'id, language, createdAt',
      devIdeas: 'id, createdAt',
      settings: 'key',
    });
    this.version(7).stores({
      attachments: 'id, kind, createdAt',
    });
    this.version(8).stores({
      categoryBudgets: 'id, category',
    });
    this.version(9).stores({
      aiMemory: 'id, key, updatedAt',
    });
    this.version(10).stores({
      attachments: 'id, kind, subjectId, createdAt',
    });
  }
}

export const db = new VeyrionDB();
