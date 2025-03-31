
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, Shield, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { ShipmentMetrics } from '@/types/deeptrack';
import { ResilienceChart } from '@/components/ResilienceChart';
import { metricAnalyzers } from '@/core/metricReasoner';
import { useBaseDataStore } from '@/store/baseState';
import { calculateShipmentMetrics } from '@/utils/analyticsUtils';

interface ShipmentResilienceChartProps {
  metrics: ShipmentMetrics;
}

const ShipmentResilienceChart: React.FC<ShipmentResilienceChartProps> = ({ metrics }) => {
  const { shipmentData } = useBaseDataStore();
  
  // Generate resilience data from the metrics and historical data
  const generateResilienceData = () => {
    // Get the current month and previous 5 months
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now);
      month.setMonth(now.getMonth() - i);
      months.push(month);
    }
    
    // Create data points for each month based on real shipment metrics
    return months.map((month, index) => {
      // Filter shipment data for this month to get accurate metrics
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthlyShipments = shipmentData.filter(shipment => {
        if (!shipment.date_of_collection) return false;
        const date = new Date(shipment.date_of_collection);
        return date >= monthStart && date <= monthEnd;
      });
      
      // Calculate metrics for this month if we have data, otherwise use trend-based estimates
      let disruption = 0;
      let cost = 0;
      let reliability = 0;
      
      if (monthlyShipments.length > 0) {
        // Calculate real metrics for this month
        const monthMetrics = calculateShipmentMetrics(monthlyShipments);
        disruption = monthMetrics.disruptionProbabilityScore * 10; // Scale to 0-100
        reliability = monthMetrics.resilienceScore;
        
        // Calculate average cost for the month
        const totalCost = monthlyShipments.reduce((sum, s) => {
          const forwarder = s.final_quote_awarded_freight_forwader_Carrier.toLowerCase();
          const quotes = s.forwarder_quotes || {};
          return sum + (quotes[forwarder] || 0);
        }, 0);
        
        const totalWeight = monthlyShipments.reduce((sum, s) => sum + (s.weight_kg || 0), 0);
        
        if (totalWeight > 0) {
          // Normalize cost to 0-100 scale for visualization
          const avgCost = totalCost / totalWeight;
          cost = Math.min(avgCost * 2, 100); // Scale for visualization
        } else {
          cost = 50; // Default if no weight data
        }
      } else {
        // If no data for this month, use trend-based estimates
        const baseline = index / 5; // Position in the timeline (0 to 1)
        
        // Create slightly varying metrics that trend toward current values
        disruption = 50 - (metrics.disruptionProbabilityScore * 5 - 25) * baseline;
        reliability = 50 + (metrics.resilienceScore - 50) * baseline;
        cost = 60 - 10 * baseline;
      }
      
      // Format month for display
      const monthName = month.toLocaleString('default', { month: 'short' });
      const yearShort = month.getFullYear().toString().substr(2);
      
      return {
        date: `${monthName} '${yearShort}`,
        disruption: Math.max(0, Math.min(100, disruption)),
        cost: Math.max(0, Math.min(100, cost)),
        reliability: Math.max(0, Math.min(100, reliability))
      };
    });
  };
  
  const resilienceData = generateResilienceData();
  
  // Get detailed metrics analysis
  const resilienceAnalysis = metricAnalyzers.resilience(metrics, shipmentData);
  const disruptionAnalysis = metricAnalyzers.disruption(metrics);
  
  // Determine trend direction
  const latestResilience = resilienceData[resilienceData.length - 1].reliability;
  const previousResilience = resilienceData[resilienceData.length - 2]?.reliability || latestResilience;
  const resilienceTrend = latestResilience - previousResilience;
  
  // Determine network health status
  const networkHealth = metricAnalyzers.networkHealth(metrics);
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Supply Chain Resilience
            </CardTitle>
            <CardDescription>
              Network resilience metrics over time
            </CardDescription>
          </div>
          
          <Badge 
            className={
              networkHealth.value >= 75 ? 'bg-green-50 text-green-700 border-green-200' :
              networkHealth.value >= 60 ? 'bg-blue-50 text-blue-700 border-blue-200' :
              networkHealth.value >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-red-50 text-red-700 border-red-200'
            }
          >
            {
              networkHealth.value >= 75 ? 'Robust' :
              networkHealth.value >= 60 ? 'Stable' :
              networkHealth.value >= 40 ? 'Vulnerable' :
              'Critical'
            }
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <ResilienceChart 
          data={resilienceData}
          isLoading={false}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm">
          <span className="font-medium">Network Health: </span>
          <span className="font-bold">{typeof networkHealth.value === 'number' ? networkHealth.value.toFixed(1) : networkHealth.value}</span>
          <div className="flex items-center gap-1 mt-1 text-xs">
            {resilienceTrend > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-amber-600" />
            )}
            <span className={resilienceTrend > 0 ? 'text-green-600' : 'text-amber-600'}>
              {Math.abs(resilienceTrend).toFixed(1)}% {resilienceTrend > 0 ? 'improvement' : 'decline'}
            </span>
          </div>
        </div>
        
        {networkHealth.value < 60 && (
          <div className="flex items-center gap-1 text-amber-600 text-xs">
            <AlertTriangle className="h-3.5 w-3.5" /> 
            {networkHealth.insights[0]}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShipmentResilienceChart;
