#!/data/data/com.termux/files/usr/bin/bash
# Audit rapide du projet Veyrion — à lancer depuis ~/durex-os
# Usage : bash audit.sh

echo "══════════════════════════════════════"
echo "  AUDIT VEYRION — $(date '+%Y-%m-%d %H:%M')"
echo "══════════════════════════════════════"

echo ""
echo "── 1. Build TypeScript ──"
if npx tsc --noEmit -p tsconfig.json > /tmp/tsc-out.txt 2>&1; then
  echo "✅ Aucune erreur TypeScript"
else
  echo "❌ Erreurs trouvées :"
  cat /tmp/tsc-out.txt
fi

echo ""
echo "── 2. Ancienne marque \"Durex\" oubliée ──"
HITS=$(grep -rn "Durex" src index.html package.json 2>/dev/null | grep -vi "durex-os\|Durex123s\|node_modules")
if [ -z "$HITS" ]; then
  echo "✅ Rien trouvé"
else
  echo "⚠️  Occurrences restantes :"
  echo "$HITS"
fi

echo ""
echo "── 3. Ancien bleu #3D8BFF codé en dur (hors presets couleur) ──"
HITS=$(grep -rn "3D8BFF" src --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "useAccentColor.ts")
if [ -z "$HITS" ]; then
  echo "✅ Rien trouvé"
else
  echo "⚠️  Occurrences restantes :"
  echo "$HITS"
fi

echo ""
echo "── 4. Données factices (MOCK_) encore utilisées ──"
HITS=$(grep -rln "MOCK_" src --include="*.tsx" --include="*.ts" 2>/dev/null)
if [ -z "$HITS" ]; then
  echo "✅ Rien trouvé"
else
  echo "⚠️  Fichiers avec données factices :"
  echo "$HITS"
fi

echo ""
echo "── 5. TODO / FIXME laissés dans le code ──"
HITS=$(grep -rn "TODO\|FIXME" src --include="*.tsx" --include="*.ts" 2>/dev/null)
if [ -z "$HITS" ]; then
  echo "✅ Rien trouvé"
else
  echo "⚠️  À traiter :"
  echo "$HITS"
fi

echo ""
echo "── 6. console.log oubliés (à nettoyer avant prod) ──"
COUNT=$(grep -rn "console\.log" src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
echo "ℹ️  $COUNT occurrence(s) trouvée(s)"

echo ""
echo "── 7. Fichiers Supabase/sync en double ──"
find src -iname "*supabaseClient*" -o -iname "*cloudSync*" -o -iname "*sync.ts" 2>/dev/null | grep -v node_modules

echo ""
echo "── 8. Icône & splash Capacitor (identité de lancement) ──"
find android/app/src/main/res -iname "ic_launcher*.png" 2>/dev/null | head -5
find . -iname "splash.png" -not -path "*/node_modules/*" 2>/dev/null

echo ""
echo "── 9. Dépendances obsolètes ──"
npm outdated 2>/dev/null || echo "ℹ️  (npm outdated n'a rien retourné ou a échoué — pas bloquant)"

echo ""
echo "── 10. Taille du bundle de build ──"
if [ -d "dist" ]; then
  du -sh dist 2>/dev/null
else
  echo "ℹ️  Pas de dossier dist/ — lance 'npm run build' d'abord pour cette section"
fi

echo ""
echo "══════════════════════════════════════"
echo "  FIN DE L'AUDIT"
echo "══════════════════════════════════════"
