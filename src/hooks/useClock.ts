import { useEffect, useState } from 'react';

// Horloge qui se met à jour chaque seconde — utilisée par le widget Dashboard.
export function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}
