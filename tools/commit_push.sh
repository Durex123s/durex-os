#!/bin/bash
# commit_push.sh — commit et push les changements récents sur GitHub
# Usage: bash commit_push.sh

echo "══════════════════════════════════════"
echo "  COMMIT & PUSH — $(date '+%Y-%m-%d %H:%M')"
echo "══════════════════════════════════════"

echo ""
echo "── Statut du repo ──"
git status --short

echo ""
echo "── Fichiers modifiés/ajoutés détectés ──"
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️  Rien à committer, le repo est propre."
    exit 0
fi

echo ""
echo "── Ajout des fichiers ──"
git add -A

echo ""
echo "── Résumé de ce qui va être commit ──"
git status --short

echo ""
read -p "Message de commit (laisse vide pour le message par défaut) : " MSG
if [ -z "$MSG" ]; then
    MSG="feat: composants Button/Modal réutilisables + refactor ProjectCard/FlashcardsSection"
fi

git commit -m "$MSG"

echo ""
echo "── Push vers origin ──"
BRANCH=$(git branch --show-current)
echo "Branche actuelle : $BRANCH"
git push origin "$BRANCH"

echo ""
echo "══════════════════════════════════════"
echo "  FIN"
echo "══════════════════════════════════════"
