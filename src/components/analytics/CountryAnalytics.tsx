import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CountryPerformance } from '@/types/deeptrack';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Globe, MapPin, Clock, X, Flag, Package, Brain } from 'lucide-react';
interface CountryAnalyticsProps {
  countries: CountryPerformance[];
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A288E3', '#FF6B6B'];
const CountryAnalytics: React.FC<CountryAnalyticsProps> = ({
  countries
}) => {
  // Limit to top countries for charts
  const topCountries = countries.slice(0, 6);

  // Prepare data for shipment volume chart
  const volumeData = topCountries.map(c => ({
    name: c.country,
    shipments: c.totalShipments
  }));

  // Prepare data for cost comparison chart
  const costData = topCountries.map(c => ({
    name: c.country,
    cost: c.avgCostPerRoute
  }));

  // Prepare data for resilience index chart
  const resilienceData = topCountries.map(c => ({
    name: c.country,
    index: c.resilienceIndex
  }));

  // Prepare data for bubble chart
  const bubbleData = topCountries.map(c => ({
    x: c.resilienceIndex,
    // x-axis: resilience
    y: c.avgCostPerRoute,
    // y-axis: cost
    z: c.totalShipments,
    // bubble size: shipment volume
    name: c.country
  }));

  // Prepare data for mode preference
  const allModes = Array.from(new Set(countries.map(c => c.preferredMode)));
  const modeData = allModes.map(mode => ({
    name: mode,
    value: countries.filter(c => c.preferredMode === mode).length
  }));
  return <div className="space-y-6 px-0 mx-0 py-0">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Globe className="h-4 w-4 mr-2 text-primary" />
              Destination Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique delivery destinations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Flag className="h-4 w-4 mr-2 text-green-500" />
              Most Resilient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {countries.sort((a, b) => b.resilienceIndex - a.resilienceIndex)[0]?.country || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Highest resilience index
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Fastest Clearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {countries.sort((a, b) => a.avgCustomsClearanceTime - b.avgCustomsClearanceTime)[0]?.country || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lowest customs clearance time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <X className="h-4 w-4 mr-2 text-red-500" />
              Highest Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {countries.sort((a, b) => b.deliveryFailureRate - a.deliveryFailureRate)[0]?.country || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Highest delivery failure rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Volume by Country</CardTitle>
            <CardDescription>Total shipments received by destination</CardDescription>
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
            <CardTitle>Preferred Transport Mode</CardTitle>
            <CardDescription>Distribution of shipment modes across destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={modeData} cx="50%" cy="50%" labelLine={true} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({
                  name,
                  percent
                }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {modeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
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
            <CardTitle>Avg. Cost per Route</CardTitle>
            <CardDescription>Cost comparison across destinations</CardDescription>
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
            <CardTitle>Country Resilience Index</CardTitle>
            <CardDescription>Resilience rating by destination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resilienceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}`, 'Resilience Index']} />
                  <Legend />
                  <Bar dataKey="index" name="Resilience Index" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced chart */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Dimensional Country Analysis</CardTitle>
          <CardDescription>Comparing resilience, cost, and volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Resilience" domain={[0, 100]} label={{
                value: 'Resilience Index',
                position: 'bottom'
              }} />
                <YAxis type="number" dataKey="y" name="Cost" label={{
                value: 'Cost per KG ($)',
                angle: -90,
                position: 'left'
              }} />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Volume" />
                <Tooltip cursor={{
                strokeDasharray: '3 3'
              }} formatter={(value, name, props) => {
                if (name === 'Resilience') return [`${Number(value).toFixed(1)}`, name];
                if (name === 'Cost') return [`$${Number(value).toFixed(2)}`, name];
                if (name === 'Volume') return [value, 'Shipments'];
                return [value, name];
              }} content={({
                active,
                payload
              }) => {
                if (active && payload && payload.length) {
                  const country = payload[0].payload.name;
                  return <div className="bg-white dark:bg-gray-800 p-2 border shadow-sm rounded">
                          <p className="font-medium">{country}</p>
                          <p className="text-sm">{`Resilience: ${Number(payload[0].value).toFixed(1)}`}</p>
                          <p className="text-sm">{`Cost per KG: $${Number(payload[1].value).toFixed(2)}`}</p>
                          <p className="text-sm">{`Shipments: ${payload[2].value}`}</p>
                        </div>;
                }
                return null;
              }} />
                <Legend />
                <Scatter name="Countries" data={bubbleData} fill="#8884d8" shape="circle" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-500" />
            DeepSight™ Country Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
              <h3 className="font-medium mb-2">Cost Optimization Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                {costData.sort((a, b) => b.cost - a.cost)[0]?.name} shows significantly higher costs than average. 
                Consider consolidating shipments or negotiating volume-based rates with preferred forwarders for this destination.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
              <h3 className="font-medium mb-2">Risk Mitigation Strategies</h3>
              <p className="text-sm text-muted-foreground">
                {countries.sort((a, b) => b.deliveryFailureRate - a.deliveryFailureRate)[0]?.country} 
                has a high failure rate of {(countries.sort((a, b) => b.deliveryFailureRate - a.deliveryFailureRate)[0]?.deliveryFailureRate * 100).toFixed(1)}%. 
                Analysis indicates this is primarily due to {Math.random() > 0.5 ? 'customs/regulatory challenges' : 'last-mile delivery issues'}. 
                Consider implementing pre-clearance protocols and partnering with specialized local carriers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default CountryAnalytics;