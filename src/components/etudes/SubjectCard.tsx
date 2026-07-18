import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Pin } from 'lucide-react';
import type { Subject } from '@/types';
import { useSubjectProgress } from '@/hooks/useQuizzes';

function SubjectIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={1.75} />;
}

export function SubjectCard({ subject }: { subject: Subject }) {
  const progress = useSubjectProgress(subject.id);

  return (
    <Link
      to={`/etudes/${subject.id}`}
      className="glass-card p-5 hover:border-electric-500/30 transition-colors flex flex-col gap-3 relative"
    >
      {subject.pinned && <Pin className="w-3.5 h-3.5 text-electric-400 absolute top-4 right-4" />}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${subject.color}22`, color: subject.color }}
      >
        <SubjectIcon name={subject.icon} className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-display font-medium text-white">{subject.name}</h3>
        <p className="text-xs text-muted mt-0.5">
          {progress?.totalResources ?? 0} ressource{(progress?.totalResources ?? 0) > 1 ? 's' : ''}
        </p>
      </div>
      <div className="h-1.5 rounded-full bg-base-700 overflow-hidden mt-1">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress?.resourceProgress ?? 0}%`, backgroundColor: subject.color }}
        />
      </div>
    </Link>
  );
}
