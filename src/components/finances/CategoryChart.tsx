import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PALETTE = ['#C9A227', '#3FAE68', '#D99A3D', '#C0435B', '#4E8C82', '#DDBC55', '#9E9688'];

interface CategoryChartProps {
  data: { category: string; amount: number }[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const sorted = [...data].sort((a, b) => b.amount - a.amount);

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-muted mb-4">Dépenses par catégorie</h3>
      {sorted.length === 0 ? (
        <p className="text-sm text-muted">Aucune dépense enregistrée pour l'instant.</p>
      ) : (
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={sorted} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="category"
                width={90}
                tick={{ fill: '#9E9688', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{ background: '#0E0E14', border: '1px solid #2A2A38', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value.toLocaleString('fr-FR')} FCFA`, 'Dépensé']}
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={16}>
                {sorted.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
