
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DataPoint {
  date: string;
  disruption: number;
  cost: number;
  reliability: number;
}

interface ResilienceChartProps {
  data: DataPoint[];
  isLoading?: boolean;
}

const ResilienceChart: React.FC<ResilienceChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="h-80 bg-muted animate-pulse rounded-lg"></div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">No resilience data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-4 h-80">
      <h3 className="text-lg font-medium mb-4">Resilience Metrics Over Time</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="disruption" 
            stroke="#ef4444" 
            activeDot={{ r: 8 }} 
            name="Disruption Risk"
          />
          <Line 
            type="monotone" 
            dataKey="cost" 
            stroke="#8b5cf6" 
            name="Cost Index"
          />
          <Line 
            type="monotone" 
            dataKey="reliability" 
            stroke="#22c55e" 
            name="Reliability Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResilienceChart;
