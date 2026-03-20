'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Case } from '@/types/case';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CaseStatusChartProps {
  cases: Case[];
  className?: string;
}

export const CaseStatusChart = ({ cases, className = '' }: CaseStatusChartProps) => {
  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      in_progress: 0,
      resolved: 0
    };

    cases.forEach(case_ => {
      if (counts.hasOwnProperty(case_.status)) {
        counts[case_.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const data = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        label: 'Cases',
        data: [statusCounts.pending, statusCounts.in_progress, statusCounts.resolved],
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)', // Orange for pending
          'rgba(59, 130, 246, 0.8)', // Blue for in progress
          'rgba(16, 185, 129, 0.8)', // Green for resolved
        ],
        borderColor: [
          'rgba(249, 115, 22, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#374151'
        }
      },
      title: {
        display: true,
        text: 'Case Status Distribution',
        font: {
          size: 16,
          family: 'Inter, system-ui, sans-serif',
          weight: 600
        },
        color: '#111827'
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: 'Inter, system-ui, sans-serif'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: 'Inter, system-ui, sans-serif'
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    }
  };

  return (
    <div className={`w-full h-80 ${className}`}>
      <Bar data={data} options={options} />
    </div>
  );
};