import { BusinessList } from '@/components/business/BusinessList';
import { useBusinessIdeas } from '@/hooks/useBusinessIdeas';

function money(v: number) {
  return `${Math.round(v).toLocaleString('fr-FR')} FCFA`;
}

export function Business() {
  const { ideas, totalClients, totalRevenue } = useBusinessIdeas();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Business</h1>
        <p className="text-muted text-sm mt-1">0 FCFA → activité rentable.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-xs text-muted">Idées</p>
          <p className="font-display text-2xl font-semibold text-white mt-1">{ideas.length}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted">Clients</p>
          <p className="font-display text-2xl font-semibold text-white mt-1">{totalClients}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted">Revenus business</p>
          <p className="font-display text-2xl font-semibold text-white mt-1">{money(totalRevenue)}</p>
        </div>
      </div>

      <BusinessList />
    </div>
  );
}
