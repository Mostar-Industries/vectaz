
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import ResilienceChart from '@/components/ResilienceChart';

type ChartDataItem = {
  date: string;
  disruption: number;
  cost: number;
  reliability: number;
};

interface ShipmentResilienceChartProps {
  title?: string;
  className?: string;
}

const mockData: ChartDataItem[] = [
  {
    date: 'Jan',
    disruption: 40,
    cost: 65,
    reliability: 80,
  },
  {
    date: 'Feb',
    disruption: 30,
    cost: 68,
    reliability: 82,
  },
  {
    date: 'Mar',
    disruption: 35,
    cost: 62,
    reliability: 79,
  },
  {
    date: 'Apr',
    disruption: 25,
    cost: 70,
    reliability: 85,
  },
  {
    date: 'May',
    disruption: 20,
    cost: 73,
    reliability: 87,
  },
  {
    date: 'Jun',
    disruption: 18,
    cost: 75,
    reliability: 90,
  },
  {
    date: 'Jul',
    disruption: 22,
    cost: 72,
    reliability: 88,
  },
  {
    date: 'Aug',
    disruption: 15,
    cost: 78,
    reliability: 92,
  },
  {
    date: 'Sep',
    disruption: 25,
    cost: 74,
    reliability: 86,
  },
  {
    date: 'Oct',
    disruption: 22,
    cost: 76,
    reliability: 87,
  },
  {
    date: 'Nov',
    disruption: 18,
    cost: 79,
    reliability: 90,
  },
  {
    date: 'Dec',
    disruption: 15,
    cost: 82,
    reliability: 94,
  },
];

const ShipmentResilienceChart: React.FC<ShipmentResilienceChartProps> = ({
  title = 'Route Resilience Metrics',
  className,
}) => {
  const isLoading = false;

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background/95 backdrop-blur-sm border border-border p-3 rounded-md shadow-md">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}:</span>
              <span className="font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[300px]">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResilienceChart />
      </CardContent>
    </Card>
  );
};

export default ShipmentResilienceChart;
