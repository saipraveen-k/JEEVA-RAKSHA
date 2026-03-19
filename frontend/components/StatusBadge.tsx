'use client';

import { cn } from '@/lib/utils';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'in_progress' | 'resolved';
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'status-pending',
    icon: Clock
  },
  in_progress: {
    label: 'In Progress',
    className: 'status-in-progress',
    icon: AlertCircle
  },
  resolved: {
    label: 'Resolved',
    className: 'status-resolved',
    icon: CheckCircle
  }
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('status-badge', config.className, className)}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </div>
  );
}
