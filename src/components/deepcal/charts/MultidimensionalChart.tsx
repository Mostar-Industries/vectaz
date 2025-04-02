
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ForwarderScore } from '../types';

interface MultidimensionalChartProps {
  results: ForwarderScore[];
}

const MultidimensionalChart: React.FC<MultidimensionalChartProps> = ({ results }) => {
  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
      <CardHeader>
        <CardTitle className="text-[#00FFD1]">Multi-Dimensional Analysis</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={150} data={results}>
            <PolarGrid stroke="#1E293B" />
            <PolarAngleAxis dataKey="forwarder" stroke="#94A3B8" />
            <PolarRadiusAxis angle={30} domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} stroke="#94A3B8" />
            <Radar 
              name="Cost" 
              dataKey="costPerformance" 
              stroke="#00FFD1" 
              fill="#00FFD1" 
              fillOpacity={0.5} 
            />
            <Radar 
              name="Time" 
              dataKey="timePerformance" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.5} 
            />
            <Radar 
              name="Reliability" 
              dataKey="reliabilityPerformance" 
              stroke="#a855f7" 
              fill="#a855f7" 
              fillOpacity={0.5} 
            />
            <Legend />
            <Tooltip 
              formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, '']} 
              contentStyle={{ background: '#0A1A2F', border: '1px solid #00FFD1', borderRadius: '0.375rem' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MultidimensionalChart;
