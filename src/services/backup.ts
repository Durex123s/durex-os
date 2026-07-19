import { db } from '@/database/db';
import { saveOrShareFile } from './nativeExport';

export const TABLE_NAMES = [
  'events', 'tasks', 'subjects', 'resources', 'flashcards', 'quizzes', 'quizAttempts',
  'transactions', 'savingsGoals', 'habits', 'pomodoroSessions', 'goals', 'chatMessages',
  'devProjects', 'devSnippets', 'devIdeas',
] as const;

// `attachments` contient un champ Blob (le fichier lui-même), qui ne survit
// pas à JSON.stringify (il devient "{}"). On le convertit en base64 à
// l'export et on le reconstruit en Blob à l'import, séparément des autres
// tables qui sont de simples objets sérialisables.
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(dataUrl: string, mimeType: string): Blob {
  const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

export async function dumpAllTables(): Promise<Record<string, unknown>> {
  const dump: Record<string, unknown> = { exportedAt: new Date().toISOString(), version: 2 };
  for (const table of TABLE_NAMES) {
    dump[table] = await (db as any)[table].toArray();
  }

  const attachments = await db.attachments.toArray();
  dump.attachments = await Promise.all(
    attachments.map(async (a) => ({ ...a, blob: await blobToBase64(a.blob) }))
  );

  return dump;
}

export async function restoreDump(dump: Record<string, unknown>): Promise<{ tablesRestored: number }> {
  let tablesRestored = 0;
  await db.transaction('rw', db.tables, async () => {
    for (const table of TABLE_NAMES) {
      if (Array.isArray(dump[table])) {
        await (db as any)[table].clear();
        await (db as any)[table].bulkAdd(dump[table]);
        tablesRestored += 1;
      }
    }

    if (Array.isArray(dump.attachments)) {
      const restored = (dump.attachments as any[]).map((a) => ({
        ...a,
        blob: typeof a.blob === 'string' ? base64ToBlob(a.blob, a.mimeType) : a.blob,
      }));
      await db.attachments.clear();
      await db.attachments.bulkAdd(restored);
      tablesRestored += 1;
    }
  });
  return { tablesRestored };
}

export async function exportAllData() {
  const dump = await dumpAllTables();
  const json = JSON.stringify(dump, null, 2);
  await saveOrShareFile(`veyrion-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`, json, 'application/json');
}

export async function importAllData(file: File): Promise<{ tablesRestored: number }> {
  const text = await file.text();
  const dump = JSON.parse(text);
  return restoreDump(dump);
}

function money(v: number) {
  return `${Math.round(v).toLocaleString('fr-FR')} FCFA`;
}

const DARK = { r: 15, g: 15, b: 25 };
const MUTED = { r: 130, g: 130, b: 140 };
const COLOR_FINANCES = { r: 79, g: 70, b: 229 };   // indigo
const COLOR_ETUDES = { r: 234, g: 88, b: 12 };     // orange
const COLOR_HABITUDES = { r: 22, g: 163, b: 74 };  // vert
const COLOR_OBJECTIFS = { r: 219, g: 39, b: 119 }; // rose

export async function exportFullReportPDF() {
  const [transactions, subjects, habits, goals, savingsGoals, tasks, events, sessions, devProjects] = await Promise.all([
    db.transactions.toArray(),
    db.subjects.toArray(),
    db.habits.toArray(),
    db.goals.toArray(),
    db.savingsGoals.toArray(),
    db.tasks.toArray(),
    db.events.toArray(),
    db.pomodoroSessions.toArray(),
    db.devProjects.toArray(),
  ]);

  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;

  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
      doc.text(`Veyrion · Rapport confidentiel`, marginX, pageHeight - 10);
      doc.text(`Page ${i} / ${pageCount}`, pageWidth - marginX, pageHeight - 10, { align: 'right' });
    }
  };

  const sectionTitle = (text: string, y: number, color: { r: number; g: number; b: number }) => {
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(marginX, y, 3, 7, 'F');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK.r, DARK.g, DARK.b);
    doc.text(text, marginX + 6, y + 5.5);
    return y + 12;
  };

  // ---- Cover header ----
  doc.setFillColor(COLOR_FINANCES.r, COLOR_FINANCES.g, COLOR_FINANCES.b);
  doc.rect(0, 0, pageWidth, 38, 'F');
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Veyrion', marginX, 18);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Rapport complet — Planning · Études · Finances · Discipline', marginX, 26);
  doc.setFontSize(9);
  doc.setTextColor(230, 230, 255);
  doc.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, marginX, 33);

  let y = 50;
  const totalIncome = transactions.filter((t: any) => t.type === 'revenu').reduce((s: number, t: any) => s + t.amount, 0);
  const totalExpense = transactions.filter((t: any) => t.type === 'depense').reduce((s: number, t: any) => s + t.amount, 0);
  const solde = totalIncome - totalExpense;

  // ============================================================
  // ---- Vue d'ensemble numérique (KPIs globaux, tous domaines) ----
  // ============================================================
  const COLOR_OVERVIEW = { r: 55, g: 65, b: 81 }; // gris ardoise neutre
  const tasksDone = tasks.filter((t: any) => t.done).length;
  const totalStudyMinutesAllTime = sessions
    .filter((s: any) => s.type === 'etude')
    .reduce((sum: number, s: any) => sum + s.durationMinutes, 0);
  const avgHabitRateAllTime = habits.length
    ? Math.round(
        habits.reduce((sum: number, h: any) => sum + (h.completedDates?.length ?? 0), 0) / habits.length
      )
    : 0;
  const activeGoals = goals.filter((g: any) => (g.progress ?? 0) < 100).length;
  const devByStatus = {
    idee: devProjects.filter((p: any) => p.status === 'idee').length,
    enCours: devProjects.filter((p: any) => p.status === 'en-cours').length,
    termine: devProjects.filter((p: any) => p.status === 'termine').length,
  };

  y = sectionTitle("Vue d'ensemble numérique", y, COLOR_OVERVIEW);
  const numericKpis = [
    { label: 'Solde global', value: money(solde) },
    { label: 'Tâches complétées', value: `${tasksDone} / ${tasks.length}` },
    { label: "Temps d'étude total", value: `${Math.floor(totalStudyMinutesAllTime / 60)}h${(totalStudyMinutesAllTime % 60).toString().padStart(2, '0')}` },
    { label: 'Jours d\'habitude cumulés', value: `${avgHabitRateAllTime} j / habitude` },
    { label: 'Événements planifiés', value: `${events.length}` },
    { label: 'Objectifs actifs', value: `${activeGoals} / ${goals.length}` },
    { label: 'Projets dev', value: `${devByStatus.enCours} en cours · ${devByStatus.termine} finis` },
    { label: "Objectifs d'épargne", value: `${savingsGoals.length}` },
  ];
  const kCols = 4;
  const kCardW = (pageWidth - marginX * 2 - (kCols - 1) * 5) / kCols;
  numericKpis.forEach((k, i) => {
    const col = i % kCols;
    const row = Math.floor(i / kCols);
    const x = marginX + col * (kCardW + 5);
    const cy = y + row * 26;
    doc.setDrawColor(225, 225, 230);
    doc.setFillColor(248, 248, 252);
    doc.roundedRect(x, cy, kCardW, 21, 2, 2, 'FD');
    doc.setFontSize(7);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(k.label, x + 3, cy + 6, { maxWidth: kCardW - 6 });
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK.r, DARK.g, DARK.b);
    doc.text(k.value, x + 3, cy + 15, { maxWidth: kCardW - 6 });
  });
  y += Math.ceil(numericKpis.length / kCols) * 26 + 8;

  // ============================================================
  // ---- Vue d'ensemble analytique (tendances 30j + comparaisons) ----
  // ============================================================
  if (y > pageHeight - 90) { doc.addPage(); y = 20; }
  const COLOR_ANALYTICS = { r: 8, g: 145, b: 178 }; // cyan analytique
  y = sectionTitle('Vue d\'ensemble analytique (30 derniers jours)', y, COLOR_ANALYTICS);

  const now = new Date();
  const rangeStart = new Date(now);
  rangeStart.setDate(rangeStart.getDate() - 29);
  rangeStart.setHours(0, 0, 0, 0);
  const prevStart = new Date(rangeStart);
  prevStart.setDate(prevStart.getDate() - 30);
  const prevEnd = new Date(rangeStart);
  prevEnd.setMilliseconds(-1);

  const inRange = (dateStr: string, start: Date, end: Date) => {
    const d = new Date(dateStr);
    return d >= start && d <= end;
  };

  const sumIf = (arr: any[], pred: (x: any) => boolean, field: string) =>
    arr.filter(pred).reduce((s, x) => s + (x[field] ?? 0), 0);

  const curExpenses = sumIf(transactions, (t: any) => t.type === 'depense' && inRange(t.date, rangeStart, now), 'amount');
  const prevExpenses = sumIf(transactions, (t: any) => t.type === 'depense' && inRange(t.date, prevStart, prevEnd), 'amount');
  const curIncome = sumIf(transactions, (t: any) => t.type === 'revenu' && inRange(t.date, rangeStart, now), 'amount');
  const prevIncome = sumIf(transactions, (t: any) => t.type === 'revenu' && inRange(t.date, prevStart, prevEnd), 'amount');
  const curStudy = sumIf(sessions, (s: any) => s.type === 'etude' && inRange(s.completedAt, rangeStart, now), 'durationMinutes');
  const prevStudy = sumIf(sessions, (s: any) => s.type === 'etude' && inRange(s.completedAt, prevStart, prevEnd), 'durationMinutes');

  const pctChange = (cur: number, prev: number) => {
    if (prev === 0) return cur === 0 ? '0%' : 'Nouveau';
    const pct = Math.round(((cur - prev) / prev) * 100);
    return `${pct > 0 ? '+' : ''}${pct}%`;
  };

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [['Indicateur', '30 derniers jours', 'Période précédente', 'Évolution']],
    body: [
      ['Dépenses', money(curExpenses), money(prevExpenses), pctChange(curExpenses, prevExpenses)],
      ['Revenus', money(curIncome), money(prevIncome), pctChange(curIncome, prevIncome)],
      [
        "Temps d'étude",
        `${Math.floor(curStudy / 60)}h${(curStudy % 60).toString().padStart(2, '0')}`,
        `${Math.floor(prevStudy / 60)}h${(prevStudy % 60).toString().padStart(2, '0')}`,
        pctChange(curStudy, prevStudy),
      ],
    ],
    headStyles: { fillColor: [COLOR_ANALYTICS.r, COLOR_ANALYTICS.g, COLOR_ANALYTICS.b], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 248, 252] },
    theme: 'striped',
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Top 5 catégories de dépenses (30 derniers jours) — barre horizontale proportionnelle
  const categoryTotals = new Map<string, number>();
  transactions
    .filter((t: any) => t.type === 'depense' && inRange(t.date, rangeStart, now))
    .forEach((t: any) => categoryTotals.set(t.category, (categoryTotals.get(t.category) ?? 0) + t.amount));
  const topCategories = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (topCategories.length > 0) {
    if (y > pageHeight - 60) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK.r, DARK.g, DARK.b);
    doc.text('Top 5 catégories de dépenses (30j)', marginX, y);
    y += 6;
    const maxVal = topCategories[0][1];
    const barMaxWidth = pageWidth - marginX * 2 - 55;
    topCategories.forEach(([cat, val]) => {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(DARK.r, DARK.g, DARK.b);
      doc.text(cat, marginX, y + 4, { maxWidth: 45 });
      const barW = maxVal > 0 ? Math.max(2, (val / maxVal) * barMaxWidth) : 2;
      doc.setFillColor(COLOR_ANALYTICS.r, COLOR_ANALYTICS.g, COLOR_ANALYTICS.b);
      doc.roundedRect(marginX + 48, y, barW, 5, 1, 1, 'F');
      doc.setFontSize(7.5);
      doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
      doc.text(money(val), marginX + 48 + barW + 3, y + 4);
      y += 8;
    });
    y += 6;
  }

  if (y > pageHeight - 40) { doc.addPage(); y = 20; }

  // ---- Finances table ----
  y = sectionTitle('Finances', y, COLOR_FINANCES);
  if (savingsGoals.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [["Objectif d'épargne", 'Actuel', 'Cible', 'Progression']],
      body: savingsGoals.map((g: any) => {
        const pct = g.target > 0 ? Math.round((g.current / g.target) * 100) : 0;
        return [g.title, money(g.current), money(g.target), `${pct}%`];
      }),
      headStyles: { fillColor: [COLOR_FINANCES.r, COLOR_FINANCES.g, COLOR_FINANCES.b], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [248, 248, 252] },
      theme: 'striped',
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(9);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text("Aucun objectif d'épargne enregistré.", marginX, y);
    y += 10;
  }

  const last10 = [...transactions]
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  if (last10.length > 0) {
    if (y > pageHeight - 60) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK.r, DARK.g, DARK.b);
    doc.text('10 dernières transactions', marginX, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [['Date', 'Type', 'Catégorie', 'Montant', 'Note']],
      body: last10.map((t: any) => [
        new Date(t.date).toLocaleDateString('fr-FR'),
        t.type === 'revenu' ? 'Revenu' : 'Dépense',
        t.category,
        money(t.amount),
        t.note ?? '—',
      ]),
      headStyles: { fillColor: [COLOR_FINANCES.r, COLOR_FINANCES.g, COLOR_FINANCES.b], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 248, 252] },
      theme: 'striped',
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // ---- Études ----
  if (y > pageHeight - 40) { doc.addPage(); y = 20; }
  y = sectionTitle('Études', y, COLOR_ETUDES);
  if (subjects.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [['Matière']],
      body: subjects.map((s: any) => [s.name]),
      headStyles: { fillColor: [COLOR_ETUDES.r, COLOR_ETUDES.g, COLOR_ETUDES.b], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [248, 248, 252] },
      theme: 'striped',
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(9);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text('Aucune matière enregistrée.', marginX, y);
    y += 10;
  }

  // ---- Habitudes ----
  if (y > pageHeight - 40) { doc.addPage(); y = 20; }
  y = sectionTitle('Habitudes & discipline', y, COLOR_HABITUDES);
  if (habits.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [['Habitude', 'Jours complétés']],
      body: habits.map((h: any) => [h.name, `${h.completedDates?.length ?? 0}`]),
      headStyles: { fillColor: [COLOR_HABITUDES.r, COLOR_HABITUDES.g, COLOR_HABITUDES.b], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [248, 248, 252] },
      theme: 'striped',
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(9);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text('Aucune habitude enregistrée.', marginX, y);
    y += 10;
  }

  // ---- Objectifs ----
  if (y > pageHeight - 40) { doc.addPage(); y = 20; }
  y = sectionTitle('Objectifs', y, COLOR_OBJECTIFS);
  if (goals.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [['Objectif', 'Cible']],
      body: goals.map((g: any) => [g.title, `${g.target} ${g.unit}`]),
      headStyles: { fillColor: [COLOR_OBJECTIFS.r, COLOR_OBJECTIFS.g, COLOR_OBJECTIFS.b], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [248, 248, 252] },
      theme: 'striped',
    });
  } else {
    doc.setFontSize(9);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text('Aucun objectif actif.', marginX, y);
  }

  addFooter();

  const pdfBase64 = doc.output('datauristring').split(',')[1];
  await saveOrShareFile(`veyrion-rapport-${new Date().toISOString().slice(0, 10)}.pdf`, pdfBase64, 'application/pdf', true);
}

export async function exportTransactionsCSV() {
  const transactions = await db.transactions.toArray();
  const header = 'Date,Type,Catégorie,Montant (FCFA),Note';
  const rows = transactions.map((t: any) =>
    [new Date(t.date).toLocaleDateString('fr-FR'), t.type, t.category, t.amount, t.note ?? ''].join(',')
  );
  const csv = [header, ...rows].join('\n');
  await saveOrShareFile(`veyrion-transactions-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv');
}
