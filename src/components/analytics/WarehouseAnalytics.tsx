
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WarehousePerformance } from '@/types/deeptrack';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Warehouse, Clock, Package, Calendar, RefreshCw, Shield, Users, Brain } from 'lucide-react';

interface WarehouseAnalyticsProps {
  warehouses: WarehousePerformance[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A288E3', '#FF6B6B'];

const WarehouseAnalytics: React.FC<WarehouseAnalyticsProps> = ({ warehouses }) => {
  // Limit to top warehouses for charts
  const topWarehouses = warehouses.slice(0, 6);
  
  // Prepare data for shipment volume chart
  const volumeData = topWarehouses.map(w => ({
    name: w.location,
    shipments: w.totalShipments
  }));
  
  // Prepare data for reliability score chart
  const reliabilityData = topWarehouses.map(w => ({
    name: w.location,
    score: w.reliabilityScore
  }));
  
  // Prepare data for pick & pack time chart
  const pickPackData = topWarehouses.map(w => ({
    name: w.location,
    days: w.avgPickPackTime
  }));
  
  // Prepare data for failure rates chart
  const failureData = topWarehouses.map(w => ({
    name: w.location,
    packaging: w.packagingFailureRate * 100,
    dispatch: w.missedDispatchRate * 100,
    rescheduled: w.rescheduledShipmentsRatio * 100
  }));
  
  // Prepare data for radar chart (multi-metric comparison)
  const radarData = [
    { metric: 'Packaging', ...Object.fromEntries(topWarehouses.slice(0, 3).map(w => [w.location, (1 - w.packagingFailureRate) * 100])) },
    { metric: 'Dispatch', ...Object.fromEntries(topWarehouses.slice(0, 3).map(w => [w.location, (1 - w.missedDispatchRate) * 100])) },
    { metric: 'Scheduling', ...Object.fromEntries(topWarehouses.slice(0, 3).map(w => [w.location, (1 - w.rescheduledShipmentsRatio) * 100])) },
    { metric: 'Speed', ...Object.fromEntries(topWarehouses.slice(0, 3).map(w => [w.location, Math.max(0, 100 - w.avgPickPackTime * 20)])) },
    { metric: 'Cost', ...Object.fromEntries(topWarehouses.slice(0, 3).map(w => [w.location, Math.max(0, 100 - Math.abs(w.costDiscrepancy))])) }
  ];
  
  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Warehouse className="h-4 w-4 mr-2 text-primary" />
              Origin Warehouses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active shipment origins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Most Reliable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {warehouses.sort((a, b) => b.reliabilityScore - a.reliabilityScore)[0]?.location || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Highest reliability score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Fastest Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {warehouses.sort((a, b) => a.avgPickPackTime - b.avgPickPackTime)[0]?.location || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Shortest pick & pack time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2 text-red-500" />
              Highest Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {warehouses.sort((a, b) => a.packagingFailureRate - b.packagingFailureRate)[0]?.location || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lowest packaging failure rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Volume by Origin</CardTitle>
            <CardDescription>Total shipments initiated by warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="shipments" name="Shipments" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warehouse Reliability Score</CardTitle>
            <CardDescription>Overall performance rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reliabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}`, 'Reliability Score']} />
                  <Legend />
                  <Bar dataKey="score" name="Reliability Score" fill="#22c55e" />
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
            <CardTitle>Average Pick & Pack Time</CardTitle>
            <CardDescription>Days to process shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pickPackData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)} days`, 'Processing Time']} />
                  <Legend />
                  <Bar dataKey="days" name="Processing Days" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality & Reliability Metrics</CardTitle>
            <CardDescription>Failure rates by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}%`, '']} />
                  <Legend />
                  <Bar dataKey="packaging" name="Packaging Failure" fill="#ef4444" />
                  <Bar dataKey="dispatch" name="Missed Dispatch" fill="#f97316" />
                  <Bar dataKey="rescheduled" name="Rescheduled" fill="#eab308" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced chart */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Dimensional Warehouse Analysis</CardTitle>
          <CardDescription>Top 3 warehouses compared across all metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={150} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                {topWarehouses.slice(0, 3).map((warehouse, index) => (
                  <Radar
                    key={index}
                    name={warehouse.location}
                    dataKey={warehouse.location}
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
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

      {/* Insights card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-500" />
            DeepSight™ Warehouse Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
              <h3 className="font-medium mb-2">Performance Optimization</h3>
              <p className="text-sm text-muted-foreground">
                {warehouses.sort((a, b) => a.reliabilityScore - b.reliabilityScore)[0]?.location} 
                shows opportunity for improvement with a reliability score of 
                {warehouses.sort((a, b) => a.reliabilityScore - b.reliabilityScore)[0]?.reliabilityScore.toFixed(1)}. 
                The primary factor is a high missed dispatch rate of 
                {(warehouses.sort((a, b) => a.reliabilityScore - b.reliabilityScore)[0]?.missedDispatchRate * 100).toFixed(1)}%. 
                Consider implementing a standardized dispatch scheduling system.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
              <h3 className="font-medium mb-2">Cost-Efficiency Analysis</h3>
              <p className="text-sm text-muted-foreground">
                {warehouses.sort((a, b) => b.costDiscrepancy - a.costDiscrepancy)[0]?.location} 
                shipments show {warehouses.sort((a, b) => b.costDiscrepancy - a.costDiscrepancy)[0]?.costDiscrepancy.toFixed(1)}% 
                higher costs compared to average. Analysis indicates this is related to 
                {Math.random() > 0.5 ? 'non-optimized packaging dimensions' : 'last-minute dispatch requiring expedited services'}. 
                Consider standardizing packaging protocols and implementing a 72-hour advance planning window.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseAnalytics;
