
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Database, Network, ArrowRightLeft, Zap, LineChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DeepCALSection: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gradient-primary flex items-center">
        <Cpu className="mr-2 h-8 w-8" />
        DeepCAL Core
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 md:col-span-2">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Real-time DeepCAL performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">System Load</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">API Requests</span>
                  <span className="text-sm font-medium">156/min</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Engine Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Database Connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">API Gateway Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">External Services (Partial)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/10">
          <CardHeader>
            <CardTitle>Engine Statistics</CardTitle>
            <CardDescription>Processing performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Processed Data</span>
                <span className="text-xl font-bold">1.28 TB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Decision Trees</span>
                <span className="text-xl font-bold">12,458</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg. Response Time</span>
                <span className="text-xl font-bold">42 ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Uptime</span>
                <span className="text-xl font-bold">99.98%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">System Architecture</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue-400/20">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Data Layer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>SupaBase Integration</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Time-Series Database</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Geospatial Indexing</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Cloud Storage (S3)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-purple-400/20">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Processing Layer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>PRIME ORIGIN Protocol</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>Neural Decision Engine</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>Multi-criteria Optimization</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>Real-time Risk Assessment</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-green-400/20">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2 mb-2">
              <LineChart className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">Visualization Layer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>3D Globe Rendering</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Real-time Data Stream</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Interactive Analytics</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Responsive UI Framework</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowRightLeft className="h-5 w-5 mr-2 text-orange-500" />
            Data Flow Diagram
          </CardTitle>
          <CardDescription>
            System architecture and data flow visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Data flow diagram visualization will be displayed here</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center p-4 bg-primary/5 border border-primary/10 rounded-lg">
        <Zap className="h-6 w-6 text-primary mr-3" />
        <div>
          <h3 className="font-medium">DeepCAL Engine Status</h3>
          <p className="text-sm text-muted-foreground">System is running optimally. Last update: Today at 10:45 AM</p>
        </div>
      </div>
    </div>
  );
};

export default DeepCALSection;
