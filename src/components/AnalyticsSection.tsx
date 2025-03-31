
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KPIPanel from '@/components/KPIPanel';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart as BarChartIcon, TrendingUp, Map, Cpu, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useBaseDataStore } from '@/store/baseState';

const demoData = [
  { name: 'China', shipments: 8, value: 2400 },
  { name: 'USA', shipments: 6, value: 1398 },
  { name: 'Germany', shipments: 5, value: 9800 },
  { name: 'UK', shipments: 4, value: 3908 },
  { name: 'France', shipments: 3, value: 4800 },
  { name: 'Spain', shipments: 3, value: 3800 },
  { name: 'Italy', shipments: 2, value: 4300 },
];

const AnalyticsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { shipmentData } = useBaseDataStore();

  // Compute KPI data from shipment data
  const kpiData = {
    totalShipments: shipmentData.length,
    totalWeight: shipmentData.reduce((sum, shipment) => sum + shipment.weight_kg, 0),
    totalVolume: shipmentData.reduce((sum, shipment) => sum + shipment.volume_cbm, 0),
    avgCostPerKg: shipmentData.reduce((sum, shipment) => {
      const avgCost = Object.values(shipment.forwarder_quotes).reduce((a, b) => a + b, 0) / 
        (Object.keys(shipment.forwarder_quotes).length || 1);
      return sum + avgCost;
    }, 0) / (shipmentData.length || 1),
    avgTransitDays: 5.7, // Placeholder - would calculate from actual data
    modeSplit: {
      air: 45,
      road: 30,
      sea: 25
    }
  };

  // Process data for charts
  const originCountries = shipmentData.reduce((acc: Record<string, number>, shipment) => {
    acc[shipment.origin_country] = (acc[shipment.origin_country] || 0) + 1;
    return acc;
  }, {});

  const destinationCountries = shipmentData.reduce((acc: Record<string, number>, shipment) => {
    acc[shipment.destination_country] = (acc[shipment.destination_country] || 0) + 1;
    return acc;
  }, {});

  const originChartData = Object.entries(originCountries)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const destChartData = Object.entries(destinationCountries)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gradient-primary flex items-center">
        <BarChartIcon className="mr-2 h-8 w-8" />
        DeepCAL Analytics
      </h1>
      
      <KPIPanel kpis={kpiData} className="mb-8" />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="deepsight">DeepSight</TabsTrigger>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={originChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#9b87f5" name="Shipments" />
                    </BarChart>
                  </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={destChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#D946EF" name="Shipments" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Analytics</CardTitle>
              <CardDescription>Detailed shipment performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Shipment analytics content will be displayed here...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <CardTitle>Route Analytics</CardTitle>
              <CardDescription>Performance metrics by route</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Route analytics content will be displayed here...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deepsight">
          <div className="space-y-6">
            <Card className="border-blue-400/20 bg-blue-50/10">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-500">
                  <Brain className="mr-2 h-5 w-5" />
                  DeepSight Intelligence
                </CardTitle>
                <CardDescription>
                  AI-powered insights based on your shipment data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50">
                    <h3 className="font-medium mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                      Cost Optimization Opportunity
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your shipments from China to USA could be optimized for better rates.
                      Consider consolidating shipments to reduce cost by up to 12%.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Map className="h-4 w-4 mr-2 text-blue-500" />
                      Route Efficiency Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The Kenya to Zimbabwe route shows high variance in transit times.
                      Consider alternative routing through Tanzania to improve consistency.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-blue-500" />
                      Carrier Performance Insight
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      DHL has shown 94% on-time delivery performance, outperforming other carriers.
                      Consider increasing allocation to DHL for time-sensitive shipments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsSection;
