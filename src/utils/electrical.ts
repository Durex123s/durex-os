// Fonctions de calcul pures — aucune dépendance UI, faciles à tester isolément.

// Résistivité du cuivre en service (Ω·mm²/m), valeur usuelle utilisée en
// installation électrique (tient compte de l'échauffement en fonctionnement).
const RHO_CUIVRE = 0.0225;

// ---------- Loi d'Ohm --------------------------------------------------------
export function ohmSolve(known: { u?: number; i?: number; r?: number }) {
  const { u, i, r } = known;
  if (u !== undefined && i !== undefined) return { u, i, r: i !== 0 ? u / i : 0, p: u * i };
  if (u !== undefined && r !== undefined) return { u, i: r !== 0 ? u / r : 0, r, p: r !== 0 ? (u * u) / r : 0 };
  if (i !== undefined && r !== undefined) return { u: i * r, i, r, p: i * i * r };
  return null;
}

// ---------- Puissance électrique ---------------------------------------------
export function calcPower(u: number, i: number, cosPhi: number, triphase: boolean) {
  return triphase ? Math.sqrt(3) * u * i * cosPhi : u * i * cosPhi;
}

// ---------- Chute de tension --------------------------------------------------
export function voltageDrop(params: { length: number; current: number; section: number; cosPhi: number; triphase: boolean }) {
  const { length, current, section, cosPhi, triphase } = params;
  if (section <= 0) return 0;
  const k = triphase ? Math.sqrt(3) : 2;
  return (k * RHO_CUIVRE * length * current * cosPhi) / section;
}

export function voltageDropPercent(drop: number, nominalVoltage: number) {
  return nominalVoltage > 0 ? (drop / nominalVoltage) * 100 : 0;
}

// ---------- Section de câble recommandée --------------------------------------
// À partir d'une chute de tension maximale admissible (en volts).
export function requiredSection(params: { length: number; current: number; maxDrop: number; cosPhi: number; triphase: boolean }) {
  const { length, current, maxDrop, cosPhi, triphase } = params;
  if (maxDrop <= 0) return 0;
  const k = triphase ? Math.sqrt(3) : 2;
  return (k * RHO_CUIVRE * length * current * cosPhi) / maxDrop;
}

// Sections normalisées (mm²) — on arrondit vers la section standard supérieure.
export const STANDARD_SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
export function nearestStandardSection(value: number) {
  return STANDARD_SECTIONS.find((s) => s >= value) ?? STANDARD_SECTIONS[STANDARD_SECTIONS.length - 1];
}

// ---------- Calibre disjoncteur ------------------------------------------------
// Calibres normalisés courants (A) — série usuelle en domestique/tertiaire.
export const STANDARD_BREAKERS = [2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
export function recommendedBreaker(loadCurrent: number, marginFactor = 1.25) {
  const target = loadCurrent * marginFactor;
  return STANDARD_BREAKERS.find((b) => b >= target) ?? STANDARD_BREAKERS[STANDARD_BREAKERS.length - 1];
}

// ---------- Facteur de puissance ------------------------------------------------
// Puissance réactive de condensateurs (kVAR) nécessaire pour passer de cosφ1 à cosφ2.
export function capacitorReactivePower(activePowerKw: number, cosPhi1: number, cosPhi2: number) {
  const tan1 = Math.tan(Math.acos(cosPhi1));
  const tan2 = Math.tan(Math.acos(cosPhi2));
  return Math.max(0, activePowerKw * (tan1 - tan2));
}

// ---------- Climatisation (estimation simplifiée) -------------------------------
// Règle usuelle : ~100 W/m² en isolation moyenne, modulée par un coefficient
// d'exposition/isolation. Résultat indicatif, pas un dimensionnement normatif.
export function coolingPowerWatts(surfaceM2: number, exposureFactor: number) {
  return surfaceM2 * 100 * exposureFactor;
}
export function wattsToBTU(watts: number) {
  return watts * 3.412;
}

// ---------- Conversions d'unités électriques ------------------------------------
export const UNIT_CONVERTERS = {
  'W→kW': (v: number) => v / 1000,
  'kW→W': (v: number) => v * 1000,
  'W→HP': (v: number) => v / 745.7,
  'HP→W': (v: number) => v * 745.7,
  'A→mA': (v: number) => v * 1000,
  'mA→A': (v: number) => v / 1000,
  'V→kV': (v: number) => v / 1000,
  'kV→V': (v: number) => v * 1000,
  'Ω→kΩ': (v: number) => v / 1000,
  'kΩ→Ω': (v: number) => v * 1000,
} as const;
export type UnitConversion = keyof typeof UNIT_CONVERTERS;
