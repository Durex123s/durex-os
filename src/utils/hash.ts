// Hash SHA-256 via l'API Web Crypto native (disponible dans tous les
// navigateurs modernes, y compris en contexte PWA). Ce n'est pas un stockage
// de mot de passe "production-grade" (pas de sel, pas de KDF lent), mais ça
// évite au moins de garder le code PIN en clair dans IndexedDB.
export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
