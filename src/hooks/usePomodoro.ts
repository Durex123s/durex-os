import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { PomodoroType } from '@/types';
import { schedulePomodoroEnd, cancelPomodoroEnd } from '@/services/notifications';
import { useAppSettings } from './useAppSettings';

const DEFAULT_DURATIONS: Record<PomodoroType, number> = { etude: 25, travail: 25, repos: 5 };
const TYPE_LABELS: Record<PomodoroType, string> = { etude: 'Étude', travail: 'Travail', repos: 'Repos' };
const SETTING_KEY = 'pomodoroDurations';

function parseDurations(raw: string | null): Record<PomodoroType, number> {
  if (!raw) return DEFAULT_DURATIONS;
  try {
    const parsed = JSON.parse(raw);
    return {
      etude: Number(parsed.etude) > 0 ? Number(parsed.etude) : DEFAULT_DURATIONS.etude,
      travail: Number(parsed.travail) > 0 ? Number(parsed.travail) : DEFAULT_DURATIONS.travail,
      repos: Number(parsed.repos) > 0 ? Number(parsed.repos) : DEFAULT_DURATIONS.repos,
    };
  } catch {
    return DEFAULT_DURATIONS;
  }
}

export function usePomodoro() {
  const { get, set } = useAppSettings();
  const DURATIONS = useMemo(() => parseDurations(get(SETTING_KEY)), [get(SETTING_KEY)]);

  const [type, setType] = useState<PomodoroType>('etude');
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.etude * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const durationsRef = useRef(DURATIONS);
  durationsRef.current = DURATIONS;

  useEffect(() => {
    if (!running) {
      setSecondsLeft(DURATIONS[type] * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DURATIONS[type]]);

  const changeType = (t: PomodoroType) => {
    setType(t);
    setSecondsLeft(DURATIONS[t] * 60);
    setRunning(false);
    cancelPomodoroEnd();
  };

  const setCustomDuration = useCallback(
    async (t: PomodoroType, minutes: number) => {
      const next = { ...durationsRef.current, [t]: minutes };
      await set(SETTING_KEY, JSON.stringify(next));
    },
    [set]
  );

  const logSession = useCallback(async (t: PomodoroType, durationMinutes: number) => {
    await db.pomodoroSessions.add({
      id: crypto.randomUUID(),
      type: t,
      durationMinutes,
      completedAt: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(intervalRef.current!);
          setRunning(false);
          logSession(type, durationsRef.current[type]);
          return durationsRef.current[type] * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, type, logSession]);

  const toggle = () => {
    setRunning((r) => {
      const next = !r;
      if (next) {
        schedulePomodoroEnd(secondsLeft, TYPE_LABELS[type]);
      } else {
        cancelPomodoroEnd();
      }
      return next;
    });
  };

  const reset = () => {
    setRunning(false);
    cancelPomodoroEnd();
    setSecondsLeft(DURATIONS[type] * 60);
  };

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');
  const percent = Math.round(((DURATIONS[type] * 60 - secondsLeft) / (DURATIONS[type] * 60)) * 100);

  return { type, changeType, running, toggle, reset, minutes, seconds, percent, durations: DURATIONS, setCustomDuration };
}

export function useTodayPomodoroTotals() {
  const totals = useLiveQuery(async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const sessions = await db.pomodoroSessions.where('completedAt').aboveOrEqual(todayStart.toISOString()).toArray();

    const sum = (t: PomodoroType) => sessions.filter((s) => s.type === t).reduce((acc, s) => acc + s.durationMinutes, 0);
    return { etude: sum('etude'), travail: sum('travail'), repos: sum('repos') };
  }, []);

  return totals ?? { etude: 0, travail: 0, repos: 0 };
}
