'use client';

import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red';
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
};

export default function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-1">
              <span className={cn(
                'text-xs font-medium',
                trend.isUp ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-lg bg-gradient-to-br text-white shadow-lg',
          colorClasses[color]
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
