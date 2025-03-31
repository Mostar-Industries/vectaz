
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
    compositeScore >= 75 ? 'text-green-600 bg-green-50 border-green-200' :
    compositeScore >= 60 ? 'text-blue-600 bg-blue-50 border-blue-200' :
    compositeScore >= 40 ? 'text-amber-600 bg-amber-50 border-amber-200' : 
                          'text-red-600 bg-red-50 border-red-200';

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
    <Card className="border rounded-lg h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-green-500" />
              Resilience Metrics Over Time
            </CardTitle>
          </div>
          
          <Badge className={`${statusColor} px-2 py-1`}>
            {healthStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
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
            />
            <Line 
              type="monotone" 
              dataKey="disruption" 
              stroke="#ef4444" 
              activeDot={{ r: 8 }} 
              name="disruption"
            />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="#8b5cf6" 
              name="cost"
            />
            <Line 
              type="monotone" 
              dataKey="reliability" 
              stroke="#22c55e" 
              name="reliability"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm">
          <span className="font-medium">Composite Score: </span>
          <span className="font-bold">{compositeScore.toFixed(1)}</span>
          {compositeScore < 60 && (
            <div className="flex items-center gap-1 text-amber-600 mt-1 text-xs">
              <AlertTriangle className="h-3.5 w-3.5" /> 
              Intervention recommended
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setExplainModalOpen(true)}
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
