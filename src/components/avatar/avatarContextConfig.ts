import type { ComponentType } from 'react';
import {
  Tablet, Wallet, Backpack, NotebookPen, Sparkles, Wrench,
  Dumbbell, Trophy, Code2, BarChart3, FolderOpen,
} from 'lucide-react';

export type AvatarContext =
  | 'dashboard' | 'finances' | 'etudes' | 'planning' | 'discipline'
  | 'outils' | 'assistant' | 'objectifs' | 'dev' | 'analytics'
  | 'parametres' | 'fichiers';

export type Pose = 'wave' | 'point' | 'hold' | 'flex' | 'think';
export type Outfit = 'casual' | 'suit' | 'backpack' | 'notepad' | 'hologram' | 'technician' | 'plain';

export interface ContextConfig {
  color: string;
  accessory: ComponentType<{ className?: string }>;
  pose: Pose;
  outfit: Outfit;
}

export const CONTEXT_CONFIG: Record<AvatarContext, ContextConfig> = {
  dashboard: { color: '#C9A227', accessory: Tablet, pose: 'wave', outfit: 'casual' },
  finances: { color: '#1e293b', accessory: Wallet, pose: 'hold', outfit: 'suit' },
  etudes: { color: '#F59E42', accessory: Backpack, pose: 'hold', outfit: 'backpack' },
  planning: { color: '#8B5CF6', accessory: NotebookPen, pose: 'point', outfit: 'notepad' },
  discipline: { color: '#C0435B', accessory: Dumbbell, pose: 'flex', outfit: 'casual' },
  outils: { color: '#EAB308', accessory: Wrench, pose: 'hold', outfit: 'technician' },
  assistant: { color: '#22D3EE', accessory: Sparkles, pose: 'think', outfit: 'hologram' },
  objectifs: { color: '#FFD166', accessory: Trophy, pose: 'flex', outfit: 'casual' },
  dev: { color: '#0EA5E9', accessory: Code2, pose: 'hold', outfit: 'casual' },
  analytics: { color: '#A855F7', accessory: BarChart3, pose: 'point', outfit: 'casual' },
  parametres: { color: '#94A3B8', accessory: Wrench, pose: 'hold', outfit: 'technician' },
  fichiers: { color: '#F97316', accessory: FolderOpen, pose: 'hold', outfit: 'casual' },
};

export function getAvatarContext(pathname: string): AvatarContext {
  const segment = pathname.split('/').filter(Boolean)[0];
  const known: AvatarContext[] = [
    'finances', 'etudes', 'planning', 'discipline', 'outils',
    'assistant', 'objectifs', 'dev', 'analytics', 'parametres', 'fichiers',
  ];
  return (known as string[]).includes(segment) ? (segment as AvatarContext) : 'dashboard';
}
