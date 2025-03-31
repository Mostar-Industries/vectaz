
import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResilienceChartProps {
  className?: string;
}

// Generates sample resilience data for the chart
const generateResilienceData = () => {
  return [
    {
      subject: 'Route Optimality',
      A: Math.floor(Math.random() * 30) + 70,
      fullMark: 100,
    },
    {
      subject: 'Weather Resistance',
      A: Math.floor(Math.random() * 30) + 70,
      fullMark: 100,
    },
    {
      subject: 'Political Stability',
      A: Math.floor(Math.random() * 30) + 70,
      fullMark: 100,
    },
    {
      subject: 'Infrastructure',
      A: Math.floor(Math.random() * 30) + 70,
      fullMark: 100,
    },
    {
      subject: 'Transport Reliability',
      A: Math.floor(Math.random() * 30) + 70,
      fullMark: 100,
    },
    {
      subject: 'Economic Factors',
      A: Math.floor(Math.random() * 30) + 70,
      fullMark: 100,
    },
  ];
};

// Custom tooltip component for the radar chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 p-2 border border-blue-500/30 rounded-md text-xs">
        <p className="text-white">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Generate the resilience score as an average of all factors
const calculateResilienceScore = (data: any[]) => {
  if (!data.length) return 0;
  
  const sum = data.reduce((acc, curr) => acc + curr.A, 0);
  return Math.round(sum / data.length);
};

const ResilienceChart: React.FC<ResilienceChartProps> = ({ className }) => {
  const resilienceData = generateResilienceData();
  const score = calculateResilienceScore(resilienceData);
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Route Resilience Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-3xl font-bold text-blue-400">{score}%</div>
            <div className="text-xs text-gray-400">Resilience</div>
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="70%" data={resilienceData}>
              <PolarGrid 
                stroke="rgba(255, 255, 255, 0.1)" 
                radialLines={false}
              />
              <PolarAngleAxis 
                dataKey="subject"
                tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 10 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={false}
                axisLine={false}
                tickCount={4}
              />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          {resilienceData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{item.subject}</span>
              <span className="text-xs font-medium text-blue-400">{item.A}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResilienceChart;
