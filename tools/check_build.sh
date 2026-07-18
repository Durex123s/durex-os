#!/bin/bash
# check_build.sh — vérifie que le code compile après les changements de design
# Usage: bash check_build.sh

OUT="$HOME/tsc-out.txt"

echo "══════════════════════════════════════"
echo "  VÉRIFICATION BUILD — $(date '+%Y-%m-%d %H:%M')"
echo "══════════════════════════════════════"

echo ""
echo "── Vérification des fichiers requis ──"
for f in src/components/ui/Button.tsx src/components/ui/Modal.tsx src/components/ui/ModalPortal.tsx; do
    if [ -f "$f" ]; then
        echo "✅ $f"
    else
        echo "❌ MANQUANT: $f"
    fi
done

echo ""
echo "── Compilation TypeScript ──"
npx tsc --noEmit > "$OUT" 2>&1
if [ -s "$OUT" ]; then
    echo "❌ Erreurs trouvées :"
    cat "$OUT"
else
    echo "✅ Aucune erreur TypeScript"
fi

echo ""
echo "── Vérification que 'clsx' est bien une dépendance ──"
if grep -q '"clsx"' package.json; then
    echo "✅ clsx présent dans package.json"
else
    echo "⚠️  clsx utilisé dans Button.tsx mais absent de package.json — lance: npm install clsx"
fi

echo ""
echo "══════════════════════════════════════"
echo "  FIN DE LA VÉRIFICATION"
echo "══════════════════════════════════════"
