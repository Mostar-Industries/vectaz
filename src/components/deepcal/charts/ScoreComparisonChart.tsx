
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ForwarderScore } from '../types';

interface ScoreComparisonChartProps {
  results: ForwarderScore[];
}

const ScoreComparisonChart: React.FC<ScoreComparisonChartProps> = ({ results }) => {
  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-sm sm:text-base md:text-lg text-[#00FFD1]">ForwarderScore™ Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 h-64 sm:h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={results} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} stroke="#94A3B8" tickMargin={5} fontSize={10} />
            <YAxis dataKey="forwarder" type="category" width={80} stroke="#94A3B8" fontSize={10} tickMargin={5} />
            <Tooltip 
              formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'DeepScore™']}
              contentStyle={{ background: '#0A1A2F', border: '1px solid #00FFD1', borderRadius: '0.375rem' }}
              wrapperStyle={{ fontSize: '0.75rem' }}
            />
            <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
            <Bar dataKey="score" name="DeepScore™" fill="#00FFD1" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ScoreComparisonChart;
