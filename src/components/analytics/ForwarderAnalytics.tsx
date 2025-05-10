import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ForwarderPerformance, CarrierPerformance } from '@/types/deeptrack';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, DollarSign, Clock, Target, Star, RotateCcw, Brain, Truck, Plane } from 'lucide-react';
import { GlobalOperationsHeader } from './GlobalOperationsHeader';
import { QuantumOptimizationMatrix } from './QuantumOptimizationMatrix';
import { RiskVisualizer } from './RiskVisualizer';
import { EthicalAlert } from './EthicalAlert';
import { CarbonRouting } from './CarbonRouting';
import { ScenarioEngine } from './ScenarioEngine';

interface ForwarderAnalyticsProps {
  forwarders: ForwarderPerformance[];
  shipments?: never;
  carriers: CarrierPerformance[];
}

const ForwarderAnalytics: React.FC<ForwarderAnalyticsProps> = ({ forwarders, carriers }) => {
  const [entityType, setEntityType] = useState<'forwarder' | 'carrier'>('forwarder');
  
  // Limit to top 5 forwarders for most charts
  const topForwarders = forwarders.slice(0, 5);
  
  // Prepare data for cost comparison chart
  const costData = topForwarders.map(f => ({
    name: f.freight_carrier,
    cost: f.avgCostPerKg
  }));
  
  // Prepare data for transit time comparison chart
  const transitTimeData = topForwarders.map(f => ({
    name: f.freight_carrier,
    days: f.avg_transit_days
  }));
  
  // Prepare data for on-time delivery chart
  const onTimeData = topForwarders.map(f => ({
    name: f.freight_carrier,
    rate: (f.shipments.filter(s => s.on_time).length / f.shipments.length * 100).toFixed(1)
  }));
  
  // Prepare data for DeepScore comparison
  const deepScoreData = topForwarders.map(f => ({
    name: f.freight_carrier,
    score: (f.avgCostPerKg + f.avg_transit_days + f.shipments.filter(s => s.on_time).length / f.shipments.length) / 3
  }));
  
  // Prepare data for radar chart (multi-metric comparison)
  const radarData = topForwarders.map(f => ({
    name: f.freight_carrier,
    cost: normalizeValue(f.avgCostPerKg, 100, true), // Lower is better, so invert
    time: normalizeValue(f.avg_transit_days, 14, true), // Lower is better, so invert
    reliability: (f.shipments.filter(s => s.on_time).length / f.shipments.length) * 100,
    onTime: (f.shipments.filter(s => s.on_time).length / f.shipments.length) * 100,
    winRate: (f.shipments.filter(s => s.won).length / f.shipments.length) * 100
  }));
  
  // Helper function to normalize values to a 0-100 scale
  function normalizeValue(value: number, max: number, invert: boolean = false): number {
    const normalized = Math.min(value / max, 1) * 100;
    return invert ? 100 - normalized : normalized;
  }

  // Use the carriers prop instead of redefining it
  // Process top carriers for visualization
  const topCarriers = carriers.slice(0, 5);

  // Convert forwarders to shipments with required properties
  const convertedShipments = forwarders.map(f => ({
    ...f,
    customs_clearance_time_days: 0, // Default value
    freight_carrier_cost: 0, // Default value
    // Other required Shipment properties
  }));

  return (
    <div className="space-y-6 p-4">
      <GlobalOperationsHeader />
      
      <Tabs defaultValue="forwarder" className="w-full" onValueChange={(value) => setEntityType(value as 'forwarder' | 'carrier')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="forwarder" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Freight Forwarders
          </TabsTrigger>
          <TabsTrigger value="carrier" className="flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            Carriers
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="forwarder">
          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Active Forwarders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{forwarders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all shipments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                  Top Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {topForwarders[0]?.freight_carrier || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on DeepScore™
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                  Best Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {forwarders.sort((a, b) => a.avgCostPerKg - b.avgCostPerKg)[0]?.freight_carrier || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lowest cost per kg
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  Fastest Transit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {forwarders.sort((a, b) => a.avg_transit_days - b.avg_transit_days)[0]?.freight_carrier || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lowest avg. transit time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main forwarder comparison chart */}
          <Card>
            <CardHeader>
              <CardTitle>Forwarder DeepScore™ Comparison</CardTitle>
              <CardDescription>Overall performance ranking considering cost, time, and reliability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deepScoreData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip 
                      formatter={(value: any) => [`${Number(value).toFixed(1)}`, 'DeepScore™']}
                    />
                    <Legend />
                    <Bar dataKey="score" name="DeepScore™" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Avg. Cost per KG</CardTitle>
                <CardDescription>Cost comparison across top forwarders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Cost per KG']} />
                      <Legend />
                      <Bar dataKey="cost" name="Cost per KG" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg. Transit Time</CardTitle>
                <CardDescription>Transit time comparison across top forwarders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transitTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)} days`, 'Transit Time']} />
                      <Legend />
                      <Bar dataKey="days" name="Transit Days" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>On-Time Delivery Rate</CardTitle>
                <CardDescription>% of shipments delivered on schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={onTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`${value}%`, 'On-Time Rate']} />
                      <Legend />
                      <Bar dataKey="rate" name="On-Time Rate" fill="#a855f7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Dimensional Analysis</CardTitle>
                <CardDescription>Comparative strengths across key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      {radarData.map((_, index) => (
                        <Radar
                          key={index}
                          name={topForwarders[index].freight_carrier}
                          dataKey={(value) => [
                            value.cost,
                            value.time,
                            value.reliability,
                            value.onTime,
                            value.winRate
                          ][index % 5]}
                          stroke={`hsl(${index * 60}, 70%, 50%)`}
                          fill={`hsl(${index * 60}, 70%, 50%)`}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-500" />
                DeepSight™ Forwarder Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  <h3 className="font-medium mb-2">Forwarder Performance Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    {topForwarders[0]?.freight_carrier} demonstrates exceptional reliability with the highest DeepScore™ of {topForwarders[0]?.score?.toFixed(1) || 'N/A'}. 
                    {topForwarders[0]?.reliability > 0.8 
                      ? ` Their reliability under adverse conditions is particularly noteworthy.`
                      : ` Consider monitoring their performance for consistency over high-volume periods.`
                    }
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  <h3 className="font-medium mb-2">Optimization Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    {forwarders.length > 3 
                      ? `With ${forwarders.length} active forwarders, there may be consolidation opportunities. Consider focusing volume with top performers to leverage better rates and service levels.`
                      : `Your current forwarder portfolio is streamlined. Consider testing an additional forwarder for specific routes to benchmark performance.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="carrier">
          {/* Carrier KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Plane className="h-4 w-4 mr-2 text-primary" />
                  Active Carriers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{carriers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all shipments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                  Top Carrier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {topCarriers.length > 0 ? 
                    (topCarriers.sort((a, b) => (b.reliability || 0) - (a.reliability || 0))[0]?.name || "N/A") : 
                    "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on reliability score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-green-500" />
                  Most Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {topCarriers.length > 0 ? 
                    (topCarriers.sort((a, b) => (b.shipments || 0) - (a.shipments || 0))[0]?.name || "N/A") : 
                    "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Highest shipment volume
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <RotateCcw className="h-4 w-4 mr-2 text-blue-500" />
                  Carrier Diversity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {carriers.length <= 3 ? "Low" : carriers.length <= 6 ? "Medium" : "High"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {carriers.length} active carriers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Carrier volume chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Carrier Volume Distribution</CardTitle>
              <CardDescription>Shipment volume by carrier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCarriers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value: any) => [`${value}`, 'Shipments']} />
                    <Legend />
                    <Bar dataKey="shipments" name="Shipment Volume" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Carrier reliability chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Carrier Reliability Scores</CardTitle>
              <CardDescription>Performance rating by carrier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCarriers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Reliability']} />
                    <Legend />
                    <Bar dataKey="reliability" name="Reliability Score" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Carrier insights card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-500" />
                DeepSight™ Carrier Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  <h3 className="font-medium mb-2">Carrier Performance Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    {topCarriers.length > 1 ?
                      `${topCarriers.sort((a, b) => (b.reliability || 0) - (a.reliability || 0))[0]?.name || "Top carrier"} demonstrates the highest reliability score, followed by ${topCarriers.sort((a, b) => (b.reliability || 0) - (a.reliability || 0))[1]?.name || "others"}. 
                      Consider allocating more critical and time-sensitive shipments to these carriers when possible.` :
                      "Not enough carrier data to perform a comparative analysis."}
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  <h3 className="font-medium mb-2">Carrier Optimization Strategy</h3>
                  <p className="text-sm text-muted-foreground">
                    {topCarriers.length > 0 ?
                      `${topCarriers.sort((a, b) => (b.shipments || 0) - (a.shipments || 0))[0]?.name || "Most used carrier"} is currently your most used carrier. 
                      ${carriers.length > 3 ? "Consider testing alternative carriers for specific routes to improve overall performance and resilience." : "Consider adding more carriers to your network for better resilience and flexibility."}` :
                      "No carrier data available for optimization analysis."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ultra-analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Quantum Optimization Matrix</h2>
              <QuantumOptimizationMatrix forwarders={forwarders} />
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">War Risk Intelligence</h2>
              <RiskVisualizer 
                threats={['Piracy', 'Sanctions', 'FuelSpikes']} 
                carriers={forwarders.map(f => f.freight_carrier)}
              />
            </div>
          </div>
          
          <EthicalAlert shipments={convertedShipments} />
          <CarbonRouting shipments={convertedShipments} />
          <ScenarioEngine />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForwarderAnalytics;
