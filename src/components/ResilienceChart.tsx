
import React, { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, Shield, AlertTriangle } from 'lucide-react';
import DeepExplainModal from './analytics/DeepExplainModal';
import { MetricExplanation } from '@/services/deepSightNarrator';

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
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  
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

  // Calculate the current resilience indicators
  const latestData = data[data.length - 1];
  const reliabilityTrend = data.length > 1 ? 
    latestData.reliability - data[data.length - 2].reliability : 0;
  
  // Generate a composite score (for demo purposes)
  const compositeScore = (
    (100 - latestData.disruption) * 0.4 + 
    (100 - latestData.cost) * 0.2 + 
    latestData.reliability * 0.4
  );
  
  // Determine health status
  const healthStatus = 
    compositeScore >= 75 ? 'Robust' :
    compositeScore >= 60 ? 'Stable' :
    compositeScore >= 40 ? 'Vulnerable' : 'Critical';
  
  // Color based on health status
  const statusColor = 
    compositeScore >= 75 ? 'bg-green-900/30 text-green-300 border-green-500/30' :
    compositeScore >= 60 ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' :
    compositeScore >= 40 ? 'bg-amber-900/30 text-amber-300 border-amber-500/30' : 
                          'bg-red-900/30 text-red-300 border-red-500/30';

  // Mock explanation for the Resilience Chart
  const resilienceExplanation: MetricExplanation = {
    title: 'Supply Chain Resilience Trend Analysis',
    description: 'This analysis tracks key resilience indicators over time to provide early warning of potential supply chain vulnerabilities.',
    calculation: 'composite_score = 0.4*(100-disruption) + 0.2*(100-cost) + 0.4*reliability',
    sampleSize: data.length,
    methodology: 'Time-series analysis with composite resilience scoring',
    interpretation: `Current composite resilience score is ${compositeScore.toFixed(1)}, indicating a ${healthStatus.toLowerCase()} network. Reliability has ${reliabilityTrend >= 0 ? 'improved' : 'declined'} by ${Math.abs(reliabilityTrend).toFixed(1)} points in the last period. Disruption risk is ${latestData.disruption > 40 ? 'elevated' : 'within acceptable parameters'} at ${latestData.disruption.toFixed(1)}.`,
    recommendations: [
      'Monitor high-risk routes for early intervention.',
      'Review carrier performance for consistently delayed routes.',
      latestData.disruption > 40 ? 'Develop contingency routing for high-disruption corridors.' : 'Maintain current routing strategies.'
    ]
  };

  return (
    <Card className="border rounded-lg h-full data-card gradient-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-cyan-400" />
              <span className="neon-text">Resilience Metrics Over Time</span>
            </CardTitle>
          </div>
          
          <Badge className={`${statusColor} px-2 py-1`}>
            {healthStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-72 tech-grid relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(53, 157, 255, 0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255, 255, 255, 0.6)"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.6)"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(10, 25, 41, 0.9)', 
                borderColor: 'rgba(53, 157, 255, 0.3)',
                color: 'white',
                borderRadius: '0.375rem',
                boxShadow: '0 0 10px rgba(0, 191, 255, 0.15)'
              }}
              itemStyle={{ color: 'rgba(255, 255, 255, 0.9)' }}
              labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
              formatter={(value, name) => {
                const formattedName = 
                  name === 'disruption' ? 'Disruption Risk' :
                  name === 'cost' ? 'Cost Index' : 'Reliability Score';
                return [typeof value === 'number' ? value.toFixed(1) : value, formattedName];
              }}
            />
            <Legend 
              formatter={(value) => {
                return value === 'disruption' ? 'Disruption Risk' :
                       value === 'cost' ? 'Cost Index' : 'Reliability Score';
              }}
              wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
            />
            <Line 
              type="monotone" 
              dataKey="disruption" 
              stroke="#ff5edf" 
              strokeWidth={2}
              activeDot={{ r: 8, fill: '#ff5edf', stroke: 'rgba(255, 94, 223, 0.3)', strokeWidth: 2 }}
              name="disruption"
              dot={{ stroke: '#ff5edf', strokeWidth: 1, r: 3, fill: '#0a1929' }}
            />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="#c45eff" 
              strokeWidth={2}
              activeDot={{ r: 8, fill: '#c45eff', stroke: 'rgba(196, 94, 255, 0.3)', strokeWidth: 2 }}
              name="cost"
              dot={{ stroke: '#c45eff', strokeWidth: 1, r: 3, fill: '#0a1929' }}
            />
            <Line 
              type="monotone" 
              dataKey="reliability" 
              stroke="#5ee7ff" 
              strokeWidth={2}
              activeDot={{ r: 8, fill: '#5ee7ff', stroke: 'rgba(94, 231, 255, 0.3)', strokeWidth: 2 }}
              name="reliability"
              dot={{ stroke: '#5ee7ff', strokeWidth: 1, r: 3, fill: '#0a1929' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-blue-500/20 pt-4">
        <div className="text-sm">
          <span className="font-medium text-gray-300">Composite Score: </span>
          <span className="font-bold neon-text">{compositeScore.toFixed(1)}</span>
          {compositeScore < 60 && (
            <div className="flex items-center gap-1 text-amber-400 mt-1 text-xs">
              <AlertTriangle className="h-3.5 w-3.5" /> 
              Intervention recommended
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setExplainModalOpen(true)}
          className="bg-blue-950/40 border-blue-500/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-100"
        >
          <Info className="h-4 w-4 mr-1" /> 
          Explain This Analysis
        </Button>
      </CardFooter>
      
      <DeepExplainModal
        open={explainModalOpen}
        onOpenChange={setExplainModalOpen}
        metricKey="resilience"
        explanation={resilienceExplanation}
      />
    </Card>
  );
};

export default ResilienceChart;
