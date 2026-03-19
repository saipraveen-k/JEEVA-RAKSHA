'use client';

import StatsCard from './StatsCard';
import { Users } from 'lucide-react';

export default function TestComponent() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Enhanced Components Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Cases"
          value={42}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          trend={{ value: 12, isUp: true }}
        />
        
        <StatsCard
          title="Pending"
          value={8}
          icon={<Users className="w-6 h-6" />}
          color="orange"
        />
        
        <StatsCard
          title="Resolved"
          value={25}
          icon={<Users className="w-6 h-6" />}
          color="green"
        />
      </div>
    </div>
  );
}
