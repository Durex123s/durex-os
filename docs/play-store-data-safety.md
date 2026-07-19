# Formulaire "Sécurité des données" — Play Console
Brouillon à recopier dans Play Console > Contenu de l'app > Sécurité des données.
Ce n'est PAS un fichier que l'app utilise — c'est une aide pour remplir le formulaire web de Google.

## Cette app collecte-t-elle ou partage-t-elle des données utilisateur ?
→ Oui

## Toutes les données sont-elles chiffrées en transit ?
→ Oui (HTTPS)

## Proposes-tu un moyen de demander la suppression des données ?
→ Oui (suppression individuelle dans l'app + contact e-mail pour suppression complète du compte)

## Catégories de données à déclarer

### Informations personnelles
- **E-mail** — Collecté. Usage : fonctionnalité de l'app (authentification). Partagé avec : personne (Supabase agit comme sous-traitant technique, pas un tiers destinataire). Optionnel (l'app fonctionne hors-ligne sans compte).
- **Nom** (si renseigné dans le profil) — Collecté. Usage : personnalisation. Optionnel.

### Photos
- **Photos** (photo de profil) — Collecté. Usage : personnalisation. Optionnel.

### Fichiers et documents
- **Fichiers et documents** (PDF/Word/Excel importés par l'utilisateur) — Collecté. Usage : fonctionnalité de l'app. Optionnel.

### Informations financières
- **Autres informations financières** (transactions, budgets, objectifs d'épargne saisis par l'utilisateur) — Collecté. Usage : fonctionnalité de l'app. Non partagé avec des tiers.

### Activité de l'app
→ Non collecté (pas d'analytics, pas de tracking d'usage)

### Identifiants de l'appareil ou autres identifiants
→ Non collecté

## Toutes les données sont-elles collectées de façon facultative ?
→ Oui : l'app fonctionne entièrement hors-ligne sans compte ; la création de compte et la
  synchronisation cloud sont des choix explicites de l'utilisateur (bouton "Se connecter").

## Sous-traitant technique à mentionner
- Supabase (hébergement base de données + authentification + stockage de fichiers)
  https://supabase.com/privacy

---
⚠️ Rappel : remplis aussi le "Questionnaire de classification du contenu" (Content rating)
séparément — étant donné les données financières traitées, choisis les catégories reflétant
fidèlement l'app (pas de contenu violent/adulte, catégorie "Outils" ou "Productivité").
