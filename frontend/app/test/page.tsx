'use client';

import StatsCard from '@/components/StatsCard';
import { Users, Clock, CheckCircle } from 'lucide-react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Enhanced Components Test</h1>
        
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
            icon={<Clock className="w-6 h-6" />}
            color="orange"
          />
          
          <StatsCard
            title="Resolved"
            value={25}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-green-600 font-semibold">✅ Enhanced Components Working!</p>
          <p className="text-gray-600">StatsCard, animations, and styling are functioning properly.</p>
        </div>
      </div>
    </div>
  );
}
