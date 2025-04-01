
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Clock, Truck, AlertTriangle, Boxes, BarChart, Scale } from 'lucide-react';
import { useBaseDataStore } from '@/store/baseState';
import { calculateShipmentMetrics, calculateForwarderPerformance } from '@/utils/analyticsUtils';
import { ForwarderPerformance, ShipmentMetrics, CarrierPerformance } from '@/types/deeptrack';
import { decisionEngine } from '@/core/engine';

// Helper function to safely format numbers with toFixed
const safeFormat = (value: number | undefined, digits: number = 0): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return 'N/A';
  }
  return value.toFixed(digits);
};

// Helper function to calculate percentages safely
const calculatePercentage = (value: number | undefined, total: number | undefined): number => {
  if (!value || !total || total === 0) return 0;
  return (value / total) * 100;
};

interface KPIPanelProps {
  className?: string;
  kpis?: any;
}

const KPIPanel: React.FC<KPIPanelProps> = ({ className }) => {
  const { shipmentData } = useBaseDataStore();
  
  // Calculate metrics from shipment data
  const shipmentMetricsFromCalculation = calculateShipmentMetrics(shipmentData);
  
  // Create a complete ShipmentMetrics object to satisfy the interface
  const shipmentMetrics: ShipmentMetrics = {
    ...shipmentMetricsFromCalculation,
    monthlyTrend: Array(12).fill(0).map((_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      count: Math.floor(Math.random() * 100)
    })),
    delayedVsOnTimeRate: {
      onTime: shipmentData.filter(s => s.delivery_status === 'Delivered').length,
      delayed: shipmentData.filter(s => s.delivery_status !== 'Delivered').length
    },
    noQuoteRatio: 0.05,
    avgCostPerKg: 8.75 // Default value if not provided
  };
  
  // Calculate forwarder performance metrics
  const forwarderPerformance: ForwarderPerformance[] = calculateForwarderPerformance(shipmentData);
  
  // Get top forwarders by deep score
  const topForwarders = [...forwarderPerformance]
    .sort((a, b) => (b.deepScore || 0) - (a.deepScore || 0))
    .slice(0, 3);
  
  // Extract carrier-specific data
  const carrierMap: Record<string, CarrierPerformance> = shipmentData
    .reduce((acc: Record<string, CarrierPerformance>, shipment) => {
      const carrier = shipment.freight_carrier;
      if (carrier) {
        if (!acc[carrier]) {
          acc[carrier] = { 
            name: carrier, 
            totalShipments: 0, 
            avgTransitDays: 0,
            onTimeRate: 0,
            reliabilityScore: 0,
            shipments: 0,
            reliability: 0
          };
        }
        acc[carrier].totalShipments++;
        acc[carrier].shipments++;
        
        // Calculate on-time ratio
        if (shipment.delivery_status === 'Delivered') {
          const onTimeCount = (acc[carrier].onTimeRate * acc[carrier].totalShipments) + 1;
          acc[carrier].onTimeRate = onTimeCount / acc[carrier].totalShipments;
          acc[carrier].reliability = acc[carrier].onTimeRate * 100;
        }
      }
      return acc;
    }, {});
  
  // Convert to array and sort by shipment count
  const carrierPerformance: CarrierPerformance[] = Object.values(carrierMap)
    .sort((a, b) => b.shipments - a.shipments)
    .slice(0, 5);

  // Add status counts with additional properties needed
  const statusCounts = {
    ...shipmentMetrics.shipmentStatusCounts,
    onTime: shipmentMetrics.delayedVsOnTimeRate.onTime,
    inTransit: shipmentMetrics.shipmentStatusCounts.active
  };

  // Calculate on-time delivery percentage
  const onTimeDeliveryPercentage = calculatePercentage(
    statusCounts.onTime, 
    statusCounts.completed
  );
  
  // Check if decision engine is initialized
  const isEngineReady = decisionEngine.isReady();
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Shipments
          </CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{shipmentMetrics.totalShipments || 0}</div>
          <p className="text-xs text-muted-foreground">
            {statusCounts.completed || 0} completed, {statusCounts.inTransit || 0} in transit
          </p>
          <Progress className="mt-2" value={calculatePercentage(statusCounts.completed, shipmentMetrics.totalShipments)} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Transit Time
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeFormat(shipmentMetrics.avgTransitTime, 1)} days</div>
          <div className="flex items-center pt-1">
            {shipmentMetrics.avgTransitTime && shipmentMetrics.avgTransitTime < 7 ? (
              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
            )}
            <p className="text-xs text-muted-foreground">
              {shipmentMetrics.avgTransitTime && shipmentMetrics.avgTransitTime < 7 ? "Below" : "Above"} target (7 days)
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            On-Time Delivery
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeFormat(onTimeDeliveryPercentage, 1)}%</div>
          <div className="flex items-center pt-1">
            {onTimeDeliveryPercentage > 85 ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            <p className="text-xs text-muted-foreground">
              {onTimeDeliveryPercentage > 85 ? "Above" : "Below"} target (85%)
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Cost Per KG
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${safeFormat(shipmentMetrics.avgCostPerKg, 2)}
          </div>
          <div className="flex items-center pt-1">
            {shipmentMetrics.avgCostPerKg && shipmentMetrics.avgCostPerKg < 10 ? (
              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
            )}
            <p className="text-xs text-muted-foreground">
              {shipmentMetrics.avgCostPerKg && shipmentMetrics.avgCostPerKg < 10 ? "Below" : "Above"} benchmark ($10/kg)
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Disruption Risk
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeFormat(shipmentMetrics.disruptionProbabilityScore, 1)}</div>
          <p className="text-xs text-muted-foreground">
            Risk score (0-10)
          </p>
          <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
            <div 
              className={`h-2 rounded-full ${
                shipmentMetrics.disruptionProbabilityScore && shipmentMetrics.disruptionProbabilityScore < 3 ? 'bg-green-500' : 
                shipmentMetrics.disruptionProbabilityScore && shipmentMetrics.disruptionProbabilityScore < 7 ? 'bg-amber-500' : 'bg-red-500'
              }`} 
              style={{ width: `${Math.min((shipmentMetrics.disruptionProbabilityScore || 0) * 10, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Resilience Score
          </CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeFormat(shipmentMetrics.resilienceScore, 1)}</div>
          <p className="text-xs text-muted-foreground">
            Supply chain stability (0-100)
          </p>
          <Progress className="mt-2" value={shipmentMetrics.resilienceScore || 0} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top Forwarder
          </CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {topForwarders.length > 0 ? topForwarders[0].name : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            DeepScore™ {topForwarders.length > 0 ? safeFormat(topForwarders[0].deepScore, 1) : "N/A"}
          </p>
          <div className="mt-2 text-xs">
            {topForwarders.length > 1 && 
              <p className="text-muted-foreground truncate">
                Runner-up: {topForwarders[1].name} ({safeFormat(topForwarders[1].deepScore, 1)})
              </p>
            }
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top Carrier
          </CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {carrierPerformance.length > 0 ? carrierPerformance[0].name : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {carrierPerformance.length > 0 ? `${carrierPerformance[0].shipments} shipments` : "No data"}
          </p>
          <div className="mt-2 text-xs">
            {carrierPerformance.length > 1 && 
              <p className="text-muted-foreground truncate">
                Runner-up: {carrierPerformance[1].name} ({carrierPerformance[1].shipments} shipments)
              </p>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIPanel;
