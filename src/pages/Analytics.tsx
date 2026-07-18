import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useAnalytics, type AnalyticsRange } from '@/hooks/useAnalytics';
import { useGoals } from '@/hooks/useGoals';

const chartTooltipStyle = {
  contentStyle: { background: '#0E0E14', border: '1px solid #2A2A38', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#fff' },
};

function DeltaBadge({ value, goodWhenUp }: { value: number | null; goodWhenUp: boolean }) {
  if (value === null) return <span className="text-[11px] text-muted">Nouveau</span>;
  if (value === 0) return <span className="text-[11px] text-muted">Stable</span>;
  const isUp = value > 0;
  const isGood = isUp === goodWhenUp;
  const Icon = isUp ? ArrowUp : ArrowDown;
  return (
    <span className={`flex items-center gap-0.5 text-[11px] font-medium ${isGood ? 'text-success' : 'text-danger'}`}>
      <Icon className="w-3 h-3" />
      {Math.abs(value)}%
    </span>
  );
}

export function Analytics() {
  const [range, setRange] = useState<AnalyticsRange>(7);
  const data = useAnalytics(range);
  const { goals } = useGoals();

  if (!data) return <p className="text-muted text-sm">Chargement...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Analytics</h1>
          <p className="text-muted text-sm mt-1">Vue d'ensemble des {range} derniers jours.</p>
        </div>
        <div className="flex gap-1.5 bg-base-800 rounded-xl p-1">
          {([7, 30] as AnalyticsRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                range === r ? 'bg-electric-500 text-onAccent font-medium' : 'text-muted hover:text-white'
              }`}
            >
              {r}j
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <p className="text-xs text-muted">Dépenses ({range}j)</p>
          <p className="text-2xl font-display font-semibold text-white mt-1">{data.totalExpensesWeek.toLocaleString('fr-FR')} FCFA</p>
          <div className="mt-1"><DeltaBadge value={data.comparison.expenses} goodWhenUp={false} /></div>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted">Revenus ({range}j)</p>
          <p className="text-2xl font-display font-semibold text-white mt-1">{data.totalIncomeWeek.toLocaleString('fr-FR')} FCFA</p>
          <div className="mt-1"><DeltaBadge value={data.comparison.income} goodWhenUp={true} /></div>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted">Temps d'étude ({range}j)</p>
          <p className="text-2xl font-display font-semibold text-white mt-1">{Math.round(data.totalStudyWeek / 60)}h{(data.totalStudyWeek % 60).toString().padStart(2, '0')}</p>
          <div className="mt-1"><DeltaBadge value={data.comparison.study} goodWhenUp={true} /></div>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted">Taux d'habitudes moyen</p>
          <p className="text-2xl font-display font-semibold text-white mt-1">{data.avgHabitRate}%</p>
          <div className="mt-1"><DeltaBadge value={data.comparison.habitRate} goodWhenUp={true} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-muted mb-4">Dépenses vs Revenus par jour</h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={data.combinedPerDay}>
                <CartesianGrid stroke="#1D1D29" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#9E9688', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => `${v.toLocaleString('fr-FR')} FCFA`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="depense" name="Dépense" fill="#C9A227" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenu" name="Revenu" fill="#3FAE68" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-muted mb-4">Temps d'étude par jour (min)</h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={data.studyPerDay}>
                <CartesianGrid stroke="#1D1D29" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#9E9688', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`${v} min`, 'Étude']} />
                <Line type="monotone" dataKey="value" stroke="#3FAE68" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-muted mb-4">Taux d'habitudes complétées (%)</h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={data.habitRatePerDay}>
                <CartesianGrid stroke="#1D1D29" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#9E9688', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`${v}%`, 'Complété']} />
                <Bar dataKey="value" fill="#D99A3D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-muted mb-4">Objectifs</h3>
          <div className="space-y-3">
            {goals.length === 0 && <p className="text-sm text-muted">Aucun objectif pour l'instant.</p>}
            {goals.map((g) => (
              <div key={g.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white">{g.title}</span>
                  <span className="text-muted">{g.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-base-700 overflow-hidden">
                  <div className="h-full rounded-full bg-electric-500" style={{ width: `${g.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
