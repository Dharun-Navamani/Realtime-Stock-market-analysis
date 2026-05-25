import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  data: { date: string; units_sold: number; revenue: number }[];
  sku: string;
}

export default function SalesChart({ data, sku }: SalesChartProps) {
  const chartData = {
    labels: data.map(d => {
       const parts = d.date.split(' ');
       return parts.length > 1 ? parts[1] : d.date; // Just show time
    }),
    datasets: [
      {
        type: 'bar' as const,
        label: `${sku} Units Sold`,
        data: data.map(d => d.units_sold),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
      {
        type: 'line' as const,
        label: 'Cumulative Revenue ($)',
        data: data.map(d => d.revenue),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y2',
        tension: 0.3,
        pointRadius: 2,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(18, 18, 22, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#27272a',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: { display: true, text: 'Units Sold', color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y2: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: { display: true, text: 'Revenue ($)', color: '#94a3b8' },
        grid: { drawOnChartArea: false },
        ticks: { color: '#10b981' }
      }
    },
    interaction: { mode: 'nearest' as const, axis: 'x' as const, intersect: false }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Chart type='bar' data={chartData as any} options={options as any} />
    </div>
  );
}
