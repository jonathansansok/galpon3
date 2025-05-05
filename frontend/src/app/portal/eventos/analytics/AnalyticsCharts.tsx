//frontend\src\app\portal\eventos\analytics\AnalyticsCharts.tsx
import { Bar, Line } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartContainer from "./ChartContainer";

interface ChartProps {
  labels: string[];
  dataValues: number[];
  showPercentage: boolean;
}

const getOptions = (showPercentage: boolean) => ({
  plugins: {
    datalabels: {
      color: (context: any) => {
        const label = context.chart.data.labels[context.dataIndex];
        return label.includes('\n') ? 'green' : 'black';
      },
      font: (context: any) => {
        const label = context.chart.data.labels[context.dataIndex];
        return {
          weight: label.includes('\n') ? 'bold' as const : 'normal' as const,
          size: label.includes('\n') ? 16 : 12,
        };
      },
      anchor: 'center' as const,
      align: 'center' as const,
      formatter: (value: number, context: any) => {
        const label = context.chart.data.labels[context.dataIndex].split(' ').join('\n');
        if (showPercentage) {
          const dataset = context.chart.data.datasets[0];
          const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          return `${label}\n${percentage}`;
        } else {
          return `${label}\n${value}`;
        }
      },
    },
    legend: {
      position: 'right' as const,
    },
  },
});

const backgroundColors = [
  'rgb(99, 198, 255)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
  'rgb(0, 255, 0)',
  'rgba(255, 99, 71, 1)',
  'rgba(60, 179, 113, 1)',
  'rgba(138, 43, 226, 1)',
  'rgba(255, 215, 0, 1)',
  'rgba(0, 191, 255, 1)',
  'rgba(255, 69, 0, 1)',
  'rgba(0, 128, 128, 1)',
  'rgba(128, 0, 128, 1)',
  'rgba(255, 140, 0, 1)',
  'rgba(0, 255, 127, 1)',
];

const borderColors = [
  'rgb(99, 198, 255)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
  'rgb(0, 255, 0)',
  'rgba(255, 99, 71, 1)',
  'rgba(60, 179, 113, 1)',
  'rgba(138, 43, 226, 1)',
  'rgba(255, 215, 0, 1)',
  'rgba(0, 191, 255, 1)',
  'rgba(255, 69, 0, 1)',
  'rgba(0, 128, 128, 1)',
  'rgba(128, 0, 128, 1)',
  'rgba(255, 140, 0, 1)',
  'rgba(0, 255, 127, 1)',
];

export const BarChart = ({ labels, dataValues, showPercentage }: ChartProps) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Eventos',
        data: dataValues,
        backgroundColor: labels.map((label, index) => {
          if (label === 'Imp. sanit.') return 'rgba(54, 162, 235, 0.8)';
          if (label === 'Sumarios') return 'rgba(255, 0, 255, 0.8)';
          return backgroundColors[index % backgroundColors.length];
        }),
        borderColor: labels.map((label, index) => {
          if (label === 'Imp. sanit.') return 'rgba(54, 162, 235, 1)';
          if (label === 'Sumarios') return 'rgba(255, 0, 255, 1)';
          return borderColors[index % borderColors.length];
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <ChartContainer>
      <Bar data={data} options={getOptions(showPercentage)} />
    </ChartContainer>
  );
};

export const LineChart = ({ labels, dataValues, showPercentage }: ChartProps) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Eventos',
        data: dataValues,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <ChartContainer>
      <Line data={data} options={getOptions(showPercentage)} />
    </ChartContainer>
  );
};