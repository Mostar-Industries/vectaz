
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
      <CardHeader>
        <CardTitle className="text-[#00FFD1]">ForwarderScore™ Comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={results} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} stroke="#94A3B8" />
            <YAxis dataKey="forwarder" type="category" width={150} stroke="#94A3B8" />
            <Tooltip 
              formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'DeepScore™']}
              contentStyle={{ background: '#0A1A2F', border: '1px solid #00FFD1', borderRadius: '0.375rem' }}
            />
            <Legend />
            <Bar dataKey="score" name="DeepScore™" fill="#00FFD1" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ScoreComparisonChart;
