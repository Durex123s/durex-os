#!/bin/bash
# extract_design.sh — extrait le code lié au design/thème pour revue visuelle
# Usage: bash extract_design.sh > design_dump.txt

echo "══════════════════════════════════════"
echo "  EXTRACTION DESIGN — $(date '+%Y-%m-%d %H:%M')"
echo "══════════════════════════════════════"

print_file() {
    local f="$1"
    if [ -f "$f" ]; then
        echo ""
        echo "── FICHIER: $f ──"
        echo "──────────────────────────────────────"
        cat "$f"
        echo ""
        echo "──────────────────────────────────────"
    fi
}

echo ""
echo "═══ 1. Config Tailwind ═══"
print_file "tailwind.config.js"
print_file "tailwind.config.ts"
print_file "tailwind.config.cjs"

echo ""
echo "═══ 2. CSS global / variables ═══"
print_file "src/index.css"
print_file "src/App.css"
print_file "src/styles/globals.css"
print_file "src/styles/theme.css"

echo ""
echo "═══ 3. Logique de thème (clair/sombre/auto) ═══"
find src -iname "*theme*" -type f 2>/dev/null | while read -r f; do
    print_file "$f"
done

echo ""
echo "═══ 4. Store Zustand lié au thème/préférences ═══"
find src -path "*store*" -iname "*.ts" -o -path "*store*" -iname "*.tsx" 2>/dev/null | grep -i -E "theme|settings|preference|ui" | while read -r f; do
    print_file "$f"
done

echo ""
echo "═══ 5. Composants UI réutilisables (Button, Card, etc.) ═══"
find src -path "*components*" \( -iname "*button*" -o -iname "*card*" -o -iname "*layout*" \) -type f 2>/dev/null | while read -r f; do
    print_file "$f"
done

echo ""
echo "═══ 6. Structure du dossier src (aperçu) ═══"
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) 2>/dev/null | sort

echo ""
echo "══════════════════════════════════════"
echo "  FIN DE L'EXTRACTION"
echo "══════════════════════════════════════"
