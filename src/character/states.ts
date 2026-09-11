export type CharacterState =
  | 'idle' | 'welcome' | 'success' | 'thinking' | 'error' | 'loading'
  | 'focus' | 'music' | 'creative' | 'achievement' | 'encouragement' | 'night'
  | 'connection' | 'disconnection' | 'pause' | 'stress' | 'joy' | 'anger'
  | 'sadness' | 'excitement' | 'learning' | 'money' | 'health' | 'travel'
  | 'love' | 'content_creation' | 'doubt' | 'big_success' | 'night_focus' | 'veyrion';

export const CHARACTER_IMAGE: Record<CharacterState, string> = {
  idle: '/character/01_idle.png',
  welcome: '/character/02_welcome.png',
  success: '/character/03_success.png',
  thinking: '/character/04_thinking.png',
  error: '/character/05_error.png',
  loading: '/character/06_loading.png',
  focus: '/character/07_focus.png',
  music: '/character/08_music.png',
  creative: '/character/09_creative.png',
  achievement: '/character/10_achievement.png',
  encouragement: '/character/11_encouragement.png',
  night: '/character/12_night.png',
  connection: '/character/13_connection.png',
  disconnection: '/character/14_disconnection.png',
  pause: '/character/15_pause.png',
  stress: '/character/16_stress.png',
  joy: '/character/17_joy.png',
  anger: '/character/18_anger.png',
  sadness: '/character/19_sadness.png',
  excitement: '/character/20_excitement.png',
  learning: '/character/21_learning.png',
  money: '/character/22_money.png',
  health: '/character/23_health.png',
  travel: '/character/24_travel.png',
  love: '/character/25_love.png',
  content_creation: '/character/26_content_creation.png',
  doubt: '/character/27_doubt.png',
  big_success: '/character/28_big_success.png',
  night_focus: '/character/29_night_focus.png',
  veyrion: '/character/30_veyrion.png',
};

// États "temporaires" : après affichage, on revient automatiquement à
// l'état permanent précédent (celui de la page). Les autres restent
// affichés tant que le contexte (page, thème) ne change pas.
export const TEMPORARY_STATES: Partial<Record<CharacterState, number>> = {
  success: 3000,
  encouragement: 3000,
  achievement: 3500,
  big_success: 4000,
  joy: 3000,
  excitement: 3000,
  error: 3500,
  connection: 2500,
  disconnection: 2500,
  doubt: 2500,
  sadness: 3000,
};

// Correspondance page -> état permanent. Le premier segment de l'URL est
// utilisé (ex: /finances/xyz -> "finances" -> money).
export const PAGE_STATE_MAP: Record<string, CharacterState> = {
  '': 'idle',
  finances: 'money',
  etudes: 'learning',
  planning: 'focus',
  discipline: 'excitement',
  assistant: 'thinking',
  objectifs: 'achievement',
  dev: 'creative',
  outils: 'creative',
  analytics: 'thinking',
  parametres: 'idle',
  fichiers: 'idle',
};

export function getPageState(pathname: string): CharacterState {
  const segment = pathname.split('/').filter(Boolean)[0] ?? '';
  return PAGE_STATE_MAP[segment] ?? 'idle';
}

// Priorité entre réactions : une réaction en cours ne peut être interrompue
// que par une autre de priorité égale ou supérieure.
export const STATE_PRIORITY: Partial<Record<CharacterState, number>> = {
  big_success: 100,
  achievement: 90,
  success: 80,
  encouragement: 70,
  joy: 60,
  excitement: 60,
  error: 85,
  disconnection: 85,
  connection: 50,
  doubt: 40,
  sadness: 40,
  thinking: 10,
};
