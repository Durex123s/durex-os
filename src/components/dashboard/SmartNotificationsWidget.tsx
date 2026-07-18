import { WidgetCard } from './WidgetCard';
import { Bell, AlertTriangle, Info } from 'lucide-react';
import { useSmartNotifications } from '@/hooks/useSmartNotifications';

export function SmartNotificationsWidget() {
  const notifications = useSmartNotifications();

  if (notifications.length === 0) return null;

  return (
    <WidgetCard title="Notifications intelligentes" icon={<Bell className="w-4 h-4" />}>
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2 ${
              n.level === 'warning' ? 'bg-danger/10 text-danger' : 'bg-base-800/60 text-white'
            }`}
          >
            {n.level === 'warning' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-electric-400" />
            )}
            <span>{n.message}</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
