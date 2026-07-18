# Durex OS — Projet complet (Étapes 1 à 7)

Assistant de vie personnel : dashboard, planning, études, finances, discipline,
outils électricien, dev, IA, objectifs, analytics et paramètres.

## Ce qui est livré à cette étape

- Architecture modulaire complète (`components/ pages/ hooks/ services/ store/
  database/ types/ utils/ assets/ layouts/ features/`)
- Design system Durex OS (Tailwind) : dark mode uniquement, noir profond
  `#08080C`, bleu électrique `#3D8BFF`, glassmorphism léger, coins arrondis,
  focus visible pour l'accessibilité, `prefers-reduced-motion` respecté
- PWA configurée (installable, prête pour le hors-ligne — le cache offline
  complet et la synchro Supabase arrivent à l'étape 7)
- Sidebar de navigation vers les 11 modules (repliable, persistée)
- **Dashboard fonctionnel** avec widgets réels :
  horloge + date + citation motivante, progression de la journée,
  tâches du jour, objectifs, prochains cours, finances (avec alerte de
  dépassement de budget), discipline (score + temps étude/travail/repos)
- Les 10 autres modules ont un écran d'attente cohérent indiquant à quelle
  étape ils seront construits

## Étape 2 — Emploi du temps intelligent (nouveau)

- **Base de données locale hors-ligne** (`src/database/db.ts`, Dexie/IndexedDB) :
  les événements survivent au rechargement de page et fonctionnent sans
  connexion internet — c'est la même base qui accueillera tâches, finances
  et habitudes aux prochaines étapes.
- **3 vues** : Mois (grille classique), Semaine (grille horaire 06h–23h),
  Jour (liste horaire détaillée) — navigation précédent/suivant/aujourd'hui.
- **Création/édition d'événement** (`EventModal`) : titre, description,
  catégorie (cours/rdv/examen/travail/événement, chacune avec sa couleur),
  priorité, dates de début/fin, et rappels multi-sélection
  (1 jour / 1h / 30 min / 10 min avant).
- **Rappels réels** (`src/services/reminders.ts`) : utilisent l'API
  Notification du navigateur. Limite honnête : ils ne survivent pas à la
  fermeture de l'onglet — sur la version Expo, `expo-notifications` prendra
  le relais avec une planification persistante côté OS.
- Le widget dashboard **"Prochains cours"** est maintenant branché sur les
  vraies données (plus de mock) et pointe vers `/planning`.

## Étape 3 — Gestion des études (nouveau)

- **Matières** (`/etudes`) : création libre (nom, couleur, icône), grille de
  cartes avec barre de progression. La matière **GEII** est pré-créée et
  épinglée en haut (📌) — c'est la "page spéciale GEII" demandée, construite
  sur le même gabarit que les autres matières pour rester cohérente et
  facile à étendre.
- **Page matière** (`/etudes/:subjectId`) à 4 onglets :
  - **Ressources** : 7 types (notes, cours, PDF, vidéos, exercices, devoirs,
    examens), chacun avec sa propre liste ; exercices/devoirs/examens ont
    une case à cocher fait/pas fait.
  - **Fiches de révision** : flashcards recto/verso avec retournement au
    clic, navigation précédent/suivant.
  - **Quiz** : création de quiz à choix multiples (questions illimitées,
    4 options, une bonne réponse), passage du quiz avec écran de score final,
    historique des tentatives conservé.
  - **Progression** : % de ressources faites + score moyen aux quiz.
- Tout est stocké dans les nouvelles tables Dexie (`subjects`, `resources`,
  `flashcards`, `quizzes`, `quizAttempts`) — toujours hors-ligne.

## Étape 4 — Finances & Discipline (nouveau)

**Finances** (`/finances`)
- Ajout rapide de transactions (revenu/dépense, catégorie, note)
- **Budgets automatiques** jour/semaine/mois : calculés à partir de 50% des
  revenus du mois (règle transparente, ajustable plus tard dans Paramètres),
  avec **alerte visuelle** dès qu'une période est dépassée
- Graphique des dépenses par catégorie (recharts)
- Objectifs d'épargne avec contributions rapides
- Historique complet des transactions

**Discipline** (`/discipline`)
- Habitudes personnalisables avec case à cocher du jour et **série (streak)**
  calculée automatiquement
- Minuteur **Pomodoro** (Étude / Travail / Repos, durées différenciées),
  chaque session terminée est enregistrée
- **Score de discipline** sur 100 : 60% taux de complétion des habitudes du
  jour + 40% temps productif (plafonné à 3h)
- Mini-calendrier heatmap des 30 derniers jours

Les widgets **Finances** et **Discipline** du dashboard sont maintenant
branchés sur ces vraies données (nouvelles tables Dexie : `transactions`,
`savingsGoals`, `habits`, `pomodoroSessions`).

## Étape 5 — Outils électricien (nouveau)

**Calculatrices** (`/outils`, onglet Calculatrices) — 8 outils, formules
pures dans `src/utils/electrical.ts` (testables indépendamment de l'UI) :
- Loi d'Ohm (résout U, I, R, P à partir de deux valeurs connues)
- Puissance (monophasé/triphasé, avec cosφ)
- Chute de tension (+ vérification du seuil normatif 3%/5%)
- Choix de la section de câble (à partir d'une chute de tension max, avec
  arrondi à la section normalisée standard)
- Choix du disjoncteur (calibre normalisé le plus proche avec marge de
  sécurité réglable)
- Facteur de puissance (dimensionnement de condensateurs pour relever le cosφ)
- Climatisation (estimation indicative W et BTU/h selon surface/exposition)
- Conversion d'unités électriques (W/kW/HP, A/mA, V/kV, Ω/kΩ)

**Bibliothèque de symboles** (`/outils`, onglet Symboles) : 15 symboles
classés par catégorie (protection, commande, mesure, sources, récepteurs),
chacun avec un pictogramme SVG simplifié et une description.

Ce module est purement calculatoire — pas de nouvelle table Dexie, tout est
recalculé à la volée à partir des champs saisis.

## Adaptation mobile (revue à cette étape)

Le projet est une PWA pensée pour être utilisée au quotidien sur téléphone,
donc la mise en page a été revue :
- **Sidebar cachée sous `md`** (tablette/desktop) ; sur mobile, une
  **barre de navigation en bas d'écran** (`MobileBottomNav`) prend le relais
  avec les 4 modules les plus utilisés (Accueil, Planning, Études, Finances)
  + un bouton **"Plus"** qui ouvre une feuille du bas listant tous les
  autres modules.
- Le contenu principal a un `padding-bottom` supplémentaire sur mobile pour
  ne pas passer sous la barre du bas, et respecte la zone de sécurité iOS
  (`env(safe-area-inset-bottom)`).
- Les vues **Mois/Semaine** du calendrier (grilles larges) défilent
  horizontalement sur petit écran au lieu de se compresser illisiblement.
- Les onglets de la page matière (Études) défilent horizontalement si
  besoin plutôt que de déborder.
- Le manifest PWA (`vite.config.ts`) est déjà configuré en `display: standalone`
  pour une installation type app mobile.

Reste à faire pour une expérience mobile idéale : boutons d'action plus
grands (zone tactile 44px), retours haptiques, et à terme le vrai portage
React Native/Expo prévu dans la feuille de route initiale.

## Étape 6 — Assistant IA, Objectifs & Notifications intelligentes (nouveau)

**Objectifs** (`/objectifs`)
- Objectifs **cumulatifs** (ex : épargner 500 000 FCFA) ou **quotidiens**
  (ex : réviser 3h/jour, coder 2h/jour, faire du sport, lire)
- **Suivi automatique** quand c'est possible : épargne branchée sur
  Finances, étude/travail branchés sur les sessions Pomodoro du jour —
  sinon suivi manuel (bouton "+")

**Assistant IA** (`/assistant`)
- Interface de chat avec actions rapides (planifier ma journée, analyser
  mes dépenses, résumer un cours, générer des fiches, créer un quiz,
  expliquer un exercice, aide en programmation)
- **Entrée vocale** via l'API Web Speech du navigateur (masquée proprement
  si le navigateur ne la supporte pas)
- ⚠️ **Important** : Durex OS est une PWA 100% client, sans backend. Appeler
  l'API Claude directement depuis le navigateur exposerait une clé API —
  ce n'est jamais sûr. `src/services/aiAssistant.ts` répond donc pour
  l'instant avec de la vraie logique locale (planification à partir de tes
  événements/tâches réels, analyse de tes vraies dépenses), et explique
  clairement quand une tâche a besoin du vrai modèle (résumer, fiches, quiz,
  code) — il suffira de brancher un backend (`/api/assistant` par exemple)
  pour débloquer ces capacités, sans changer la signature de `askAssistant`.

**Notifications intelligentes** — widget sur le dashboard (`useSmartNotifications`),
règles lisant les vraies données : événement important demain, budget du
jour dépassé, pas d'étude aujourd'hui (après 18h), pas d'épargne cette
semaine, habitudes pas cochées (après 20h).

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5173`.

## Notes d'architecture

- **Zustand** (`src/store`) : uniquement les préférences UI persistées
  (sidebar, ordre des widgets). Les données métier (tâches, finances...)
  passeront par `src/database` (SQLite via Dexie côté web) à partir de
  l'étape 2, pour garantir le fonctionnement hors-ligne.
- **Types** (`src/types`) : partagés entre web et la future coquille
  React Native/Expo — aucune dépendance DOM à l'intérieur.
- **Widgets dashboard** : chaque widget est un composant autonome dans
  `src/components/dashboard`, actuellement branché sur des données de
  démonstration (`MOCK_*`), prêt à être reconnecté aux vraies données.
- **Personnalisation du dashboard** : le store expose déjà
  `dashboardWidgets` (visibilité + ordre) — l'UI de réorganisation sera
  ajoutée dans le module Paramètres (étape 7).

## Étape 7 — Dev, Analytics & Paramètres (nouveau, module final)

**Espace développeur** (`/dev`)
- Projets (statut idée/en cours/terminé, lien GitHub, notes, checklist inline avec progression)
- Idées (ajout rapide titre + détail)
- Snippets de code (par langage, copie en un clic)

**Analytics** (`/analytics`)
- Dépenses par jour, temps d'étude par jour, taux d'habitudes complétées
  (graphiques recharts), sur les 7 derniers jours
- Vue d'ensemble de tous les objectifs

**Paramètres** (`/parametres`)
- **Sauvegarde/restauration** : export JSON complet de toutes les tables
  (télécharge un fichier), import pour tout restaurer ; export CSV des
  transactions (s'ouvre dans Excel/Sheets)
- **Personnalisation** : afficher/masquer chaque widget du dashboard —
  réellement branché cette fois (le Dashboard ne rend que les widgets
  visibles, dans l'ordre choisi)
- **Sécurité** : code PIN (haché en SHA-256 avant stockage, jamais en
  clair) verrouillant l'app au lancement ; biométrie annoncée comme
  "bientôt" (nécessite le portage Expo, indisponible nativement dans un
  navigateur)
- **Synchronisation** : section honnête — Supabase n'est pas encore
  connecté, explique concrètement ce qu'il faudrait faire pour l'activer

## Bilan — les 7 étapes sont terminées

Dashboard personnalisable, Emploi du temps, Études (avec GEII, fiches, quiz),
Finances & Discipline, Outils électricien, Assistant IA/Objectifs/Notifications,
Dev/Analytics/Paramètres — tous fonctionnels, tous hors-ligne (Dexie/IndexedDB),
tous adaptés mobile (sidebar → barre de navigation basse sous `md`).

Pistes naturelles pour la suite, si tu veux continuer au-delà de la feuille
de route initiale :
- Vraie synchronisation Supabase (auth + sync bidirectionnelle par table)
- Backend léger pour brancher l'Assistant IA sur le vrai modèle Claude
- Portage React Native/Expo pour une vraie app mobile installable (biométrie
  native, notifications persistantes même app fermée)
- Export PDF des rapports Analytics

Dis-moi ce que tu veux approfondir en premier.
