export const MOTIVATIONAL_QUOTES = [
  "La discipline est le pont entre les objectifs et les résultats.",
  "Chaque heure d'étude aujourd'hui est une heure de liberté demain.",
  "Ce n'est pas la vitesse qui compte, c'est la régularité.",
  "Un petit progrès chaque jour finit par produire de grands résultats.",
  "Ton futur toi te remerciera pour ce que tu fais maintenant.",
  "L'ordre extérieur crée la clarté intérieure.",
];

export function getDailyQuote(): string {
  const dayIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[dayIndex];
}
