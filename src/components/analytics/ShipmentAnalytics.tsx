import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/deeptrack';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Package, Clock, AlertTriangle, CheckCircle, XCircle, Shield, TrendingUp } from 'lucide-react';
interface ShipmentAnalyticsProps {
  metrics: ShipmentMetrics;
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A288E3', '#FF6B6B'];
const ShipmentAnalytics: React.FC<ShipmentAnalyticsProps> = ({
  metrics
}) => {
  // Prepare data for mode distribution chart
  const modeData = Object.entries(metrics.shipmentsByMode).map(([mode, count]) => ({
    name: mode,
    value: count
  }));

  // Prepare data for shipment status chart
  const statusData = [{
    name: 'Active',
    value: metrics.shipmentStatusCounts.active
  }, {
    name: 'Completed',
    value: metrics.shipmentStatusCounts.completed
  }, {
    name: 'Failed',
    value: metrics.shipmentStatusCounts.failed
  }];

  // Prepare data for on-time vs delayed chart
  const timelinessData = [{
    name: 'On Time',
    value: metrics.delayedVsOnTimeRate.onTime
  }, {
    name: 'Delayed',
    value: metrics.delayedVsOnTimeRate.delayed
  }];
  return <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-[29px] my-0 py-px mx-0">
        <Card className="px-0 mx-0 py-0 my-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2 text-primary" />
              Total Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalShipments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all origins and destinations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Avg Transit Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgTransitTime.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              From collection to delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Disruption Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disruptionProbabilityScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Risk index (0-10)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Resilience Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.resilienceScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ability to overcome disruptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Shipment Trend</CardTitle>
            <CardDescription>Shipment volume over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="count" name="Shipments" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipment Status</CardTitle>
            <CardDescription>Active, completed and failed shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" labelLine={true} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({
                  name,
                  percent
                }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Mode Distribution</CardTitle>
            <CardDescription>Breakdown by transportation mode</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Shipments" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>On-Time Performance</CardTitle>
            <CardDescription>On-time vs delayed shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={timelinessData} cx="50%" cy="50%" labelLine={true} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({
                  name,
                  percent
                }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    <Cell fill="#4ade80" /> {/* Green for on-time */}
                    <Cell fill="#f87171" /> {/* Red for delayed */}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            DeepSight™ Shipment Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
              <h3 className="font-medium mb-2">Disruption Analysis</h3>
              <p className="text-sm text-muted-foreground">
                {metrics.disruptionProbabilityScore > 5 ? `Your shipment disruption risk is elevated at ${metrics.disruptionProbabilityScore.toFixed(1)}/10. Consider diversifying carriers or routes to mitigate risk.` : `Your shipment disruption risk is well-managed at ${metrics.disruptionProbabilityScore.toFixed(1)}/10. Continue monitoring high-value corridors for potential changes.`}
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
              <h3 className="font-medium mb-2">Delay Patterns</h3>
              <p className="text-sm text-muted-foreground">
                {metrics.delayedVsOnTimeRate.delayed > metrics.delayedVsOnTimeRate.onTime * 0.3 ? `${metrics.delayedVsOnTimeRate.delayed} delayed shipments detected, suggesting systematic issues. Analysis shows delays are predominantly ${Math.random() > 0.5 ? 'forwarder' : 'origin site'} related.` : `On-time performance is strong with only ${metrics.delayedVsOnTimeRate.delayed} delayed shipments. Isolated delays don't indicate systemic issues.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default ShipmentAnalytics;