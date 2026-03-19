'use client';

import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
  className?: string;
}

const priorityConfig = {
  low: {
    label: 'Low',
    className: 'bg-gray-100 text-gray-700 border-gray-300'
  },
  medium: {
    label: 'Medium',
    className: 'bg-orange-100 text-orange-700 border-orange-300'
  },
  high: {
    label: 'High',
    className: 'bg-red-100 text-red-700 border-red-300 animate-pulse'
  }
};

export default function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <div className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </div>
  );
}
