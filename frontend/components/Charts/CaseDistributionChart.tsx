'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Case } from '@/types/case';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface CaseDistributionChartProps {
  cases: Case[];
  className?: string;
}

export const CaseDistributionChart = ({ cases, className = '' }: CaseDistributionChartProps) => {
  const getAnimalTypeCounts = () => {
    const counts: Record<string, number> = {};
    
    cases.forEach(case_ => {
      const type = case_.animalType.toLowerCase();
      counts[type] = (counts[type] || 0) + 1;
    });

    return counts;
  };

  const animalTypeCounts = getAnimalTypeCounts();
  const labels = Object.keys(animalTypeCounts);
  const dataValues = Object.values(animalTypeCounts);

  const data = {
    labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          '#3b82f6', // Blue
          '#10b981', // Green
          '#f59e0b', // Orange
          '#ef4444', // Red
          '#8b5cf6', // Purple
          '#06b6d4', // Cyan
          '#84cc16', // Lime
          '#f97316', // Orange
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#374151',
          padding: 20,
          usePointStyle: true,
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => ({
                text: `${label}: ${data.datasets[0].data[i]}`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor,
                lineWidth: data.datasets[0].borderWidth,
                hidden: false,
                index: i
              }));
            }
            return [];
          }
        }
      },
      title: {
        display: true,
        text: 'Case Distribution by Animal Type',
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
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} cases (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeInOutQuart' as const
    }
  };

  return (
    <div className={`w-full h-80 ${className}`}>
      <Pie data={data} options={options} />
    </div>
  );
};