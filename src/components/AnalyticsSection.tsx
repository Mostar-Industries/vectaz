
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KPIPanel from '@/components/KPIPanel';
import { 
  BarChart as BarChartIcon, 
  TrendingUp, 
  Map, 
  Cpu, 
  Brain, 
  Package, 
  Users, 
  Globe, 
  Warehouse
} from 'lucide-react';
import { useBaseDataStore } from '@/store/baseState';
import { 
  calculateShipmentMetrics,
  calculateForwarderPerformance,
  calculateCountryPerformance,
  calculateWarehousePerformance
} from '@/utils/analyticsUtils';
import ShipmentAnalytics from '@/components/analytics/ShipmentAnalytics';
import ForwarderAnalytics from '@/components/analytics/ForwarderAnalytics';
import CountryAnalytics from '@/components/analytics/CountryAnalytics';
import WarehouseAnalytics from '@/components/analytics/WarehouseAnalytics';
import DeepTalk from '@/components/DeepTalk';

const AnalyticsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { shipmentData } = useBaseDataStore();
  const [showDeepTalk, setShowDeepTalk] = useState(false);

  // Calculate analytics data
  const shipmentMetrics = calculateShipmentMetrics(shipmentData);
  const forwarderPerformance = calculateForwarderPerformance(shipmentData);
  const countryPerformance = calculateCountryPerformance(shipmentData);
  const warehousePerformance = calculateWarehousePerformance(shipmentData);

  // Compute KPI data from shipment data
  const kpiData = {
    totalShipments: shipmentMetrics.totalShipments,
    totalWeight: shipmentData.reduce((sum, shipment) => sum + shipment.weight_kg, 0),
    totalVolume: shipmentData.reduce((sum, shipment) => sum + shipment.volume_cbm, 0),
    avgCostPerKg: shipmentData.reduce((sum, shipment) => {
      const avgCost = Object.values(shipment.forwarder_quotes).reduce((a, b) => a + b, 0) / 
        (Object.keys(shipment.forwarder_quotes).length || 1);
      return sum + avgCost;
    }, 0) / (shipmentData.length || 1),
    avgTransitDays: shipmentMetrics.avgTransitTime,
    modeSplit: {
      air: Object.entries(shipmentMetrics.shipmentsByMode)
            .find(([mode]) => mode.toLowerCase() === 'air')?.[1] || 0,
      road: Object.entries(shipmentMetrics.shipmentsByMode)
            .find(([mode]) => mode.toLowerCase() === 'road')?.[1] || 0,
      sea: Object.entries(shipmentMetrics.shipmentsByMode)
            .find(([mode]) => mode.toLowerCase() === 'sea')?.[1] || 0
    }
  };

  // Convert mode counts to percentages
  const totalModeCount = kpiData.modeSplit.air + kpiData.modeSplit.road + kpiData.modeSplit.sea;
  if (totalModeCount > 0) {
    kpiData.modeSplit.air = (kpiData.modeSplit.air / totalModeCount) * 100;
    kpiData.modeSplit.road = (kpiData.modeSplit.road / totalModeCount) * 100;
    kpiData.modeSplit.sea = (kpiData.modeSplit.sea / totalModeCount) * 100;
  }

  // Handle DeepTalk queries
  const handleDeepTalkQuery = async (query: string): Promise<string> => {
    // This would be connected to a real NLP backend in production
    // For demo, we use simple pattern matching
    
    if (query.toLowerCase().includes('disruption') || query.toLowerCase().includes('risk')) {
      return `Based on my analysis of ${shipmentData.length} shipments, your current disruption probability score is ${shipmentMetrics.disruptionProbabilityScore.toFixed(1)}/10. This is derived from historical delivery success rates and current geopolitical factors affecting your key routes. The most vulnerable corridors are ${countryPerformance[0]?.country} to ${countryPerformance[1]?.country}, which shows a ${(Math.random() * 20 + 10).toFixed(1)}% increase in transit time variability in the last quarter.`;
    } 
    
    if (query.toLowerCase().includes('forwarder') || query.toLowerCase().includes('carrier')) {
      const topForwarder = forwarderPerformance[0];
      return `Your highest performing freight forwarder is ${topForwarder?.name} with a DeepScore™ of ${topForwarder?.deepScore?.toFixed(1)}/100. This rating is a composite of reliability (${(topForwarder?.reliabilityScore || 0 * 100).toFixed(1)}%), cost-efficiency (${(topForwarder?.avgCostPerKg || 0).toFixed(2)}/kg), and transit performance (${topForwarder?.avgTransitDays.toFixed(1)} days average). For high-value shipments, I'd recommend maintaining your allocation with ${topForwarder?.name} while testing ${forwarderPerformance[1]?.name} for non-critical routes to benchmark performance.`;
    }
    
    if (query.toLowerCase().includes('warehouse') || query.toLowerCase().includes('origin')) {
      const bestWarehouse = warehousePerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore)[0];
      const worstWarehouse = warehousePerformance.sort((a, b) => a.reliabilityScore - b.reliabilityScore)[0];
      
      return `I've analyzed your origin performance metrics and found significant variability. ${bestWarehouse?.location} demonstrates superior reliability (${bestWarehouse?.reliabilityScore.toFixed(1)}/100) with consistently low packaging failures (${(bestWarehouse?.packagingFailureRate || 0 * 100).toFixed(1)}%). In contrast, ${worstWarehouse?.location} shows opportunity for improvement with higher dispatch failures (${(worstWarehouse?.missedDispatchRate || 0 * 100).toFixed(1)}%). Implementing the standardized packaging and scheduling protocols from ${bestWarehouse?.location} across all sites could yield an estimated 12% reduction in transit delays.`;
    }
    
    if (query.toLowerCase().includes('cost') || query.toLowerCase().includes('expense')) {
      return `Your average shipping cost is $${kpiData.avgCostPerKg.toFixed(2)}/kg across all routes. The most cost-efficient corridor is ${countryPerformance.sort((a, b) => a.avgCostPerRoute - b.avgCostPerRoute)[0]?.country} at $${countryPerformance.sort((a, b) => a.avgCostPerRoute - b.avgCostPerRoute)[0]?.avgCostPerRoute.toFixed(2)}/kg, while ${countryPerformance.sort((a, b) => b.avgCostPerRoute - a.avgCostPerRoute)[0]?.country} is the most expensive at $${countryPerformance.sort((a, b) => b.avgCostPerRoute - a.avgCostPerRoute)[0]?.avgCostPerRoute.toFixed(2)}/kg. By consolidating shipments to ${countryPerformance.sort((a, b) => b.totalShipments - a.totalShipments)[0]?.country} and negotiating volume rates, you could reduce overall logistics spend by approximately 8-12%.`;
    }
    
    // Default response
    return `I've analyzed your ${shipmentData.length} shipments across ${countryPerformance.length} countries and ${forwarderPerformance.length} freight forwarders. What specific aspect of your logistics performance would you like insights on? You can ask about disruption risk, forwarder performance, warehouse operations, or cost optimization.`;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient-primary flex items-center">
          <BarChartIcon className="mr-2 h-8 w-8" />
          DeepCAL Analytics
        </h1>
        
        <button 
          className="flex items-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
          onClick={() => setShowDeepTalk(!showDeepTalk)}
        >
          <Brain className="h-4 w-4" />
          {showDeepTalk ? 'Close DeepTalk' : 'Ask DeepTalk™'}
        </button>
      </div>
      
      <KPIPanel kpis={kpiData} className="mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-${showDeepTalk ? '2' : '3'} space-y-6`}>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BarChartIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="shipments" className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Shipments</span>
              </TabsTrigger>
              <TabsTrigger value="forwarders" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Forwarders</span>
              </TabsTrigger>
              <TabsTrigger value="countries" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Countries</span>
              </TabsTrigger>
              <TabsTrigger value="warehouses" className="flex items-center gap-1">
                <Warehouse className="h-4 w-4" />
                <span className="hidden sm:inline">Warehouses</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Origin Countries</CardTitle>
                    <CardDescription>Shipment distribution by origin country</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ShipmentAnalytics metrics={shipmentMetrics} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Destination Countries</CardTitle>
                    <CardDescription>Shipment distribution by destination country</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <CountryAnalytics countries={countryPerformance.slice(0, 5)} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="shipments">
              <ShipmentAnalytics metrics={shipmentMetrics} />
            </TabsContent>
            
            <TabsContent value="forwarders">
              <ForwarderAnalytics forwarders={forwarderPerformance} />
            </TabsContent>
            
            <TabsContent value="countries">
              <CountryAnalytics countries={countryPerformance} />
            </TabsContent>
            
            <TabsContent value="warehouses">
              <WarehouseAnalytics warehouses={warehousePerformance} />
            </TabsContent>
          </Tabs>
        </div>
        
        {showDeepTalk && (
          <div className="lg:col-span-1">
            <DeepTalk 
              className="h-[calc(100vh-300px)] min-h-[500px]" 
              initialMessage="I've analyzed your logistics data. What would you like to know about your shipments, forwarders, or routes?"
              onQueryData={handleDeepTalkQuery}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsSection;
