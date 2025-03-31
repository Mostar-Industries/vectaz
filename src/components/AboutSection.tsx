
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Globe, Zap, Shield, Cpu, BarChart4 } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gradient-primary flex items-center">
        <Info className="mr-2 h-8 w-8" />
        About DeepCAL
      </h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>DeepCAL: Cargo Augmented Logistics</CardTitle>
          <CardDescription>Prime Origin Protocol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              DeepCAL (Cargo Augmented Logistics) is a next-generation logistics optimization platform 
              developed by Mostar Industries. The system leverages advanced algorithms and real-time 
              data analysis to provide intelligent routing, cost optimization, and risk assessment 
              for global cargo shipments.
            </p>
            <p>
              Using the proprietary PRIME ORIGIN PROTOCOL, DeepCAL integrates with existing supply 
              chain systems to provide unprecedented visibility and control over the entire logistics process.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4">Core Capabilities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue-400/20 bg-blue-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle className="text-blue-600 dark:text-blue-400">Global Visualization</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Interactive 3D globe with real-time shipment tracking and route visualization 
              for comprehensive global supply chain monitoring.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-400/20 bg-purple-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <BarChart4 className="h-5 w-5 text-purple-500" />
              </div>
              <CardTitle className="text-purple-600 dark:text-purple-400">Advanced Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Deep analysis capabilities with predictive modeling to optimize logistics operations 
              and identify cost-saving opportunities across routes and carriers.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-400/20 bg-emerald-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Zap className="h-5 w-5 text-emerald-500" />
              </div>
              <CardTitle className="text-emerald-600 dark:text-emerald-400">Intelligent Optimization</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              AI-powered route optimization and carrier selection to minimize costs, reduce transit times, 
              and enhance overall supply chain efficiency.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-400/20 bg-amber-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Shield className="h-5 w-5 text-amber-500" />
              </div>
              <CardTitle className="text-amber-600 dark:text-amber-400">Risk Assessment</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Comprehensive risk analysis for each shipment, identifying potential disruptions 
              and providing mitigation strategies to ensure delivery reliability.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-red-400/20 bg-red-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <Cpu className="h-5 w-5 text-red-500" />
              </div>
              <CardTitle className="text-red-600 dark:text-red-400">DeepSight Technology</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Proprietary AI algorithms that provide intelligent insights and recommendations 
              based on complex pattern recognition and predictive modeling.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-12">
        <p>© {new Date().getFullYear()} Mostar Industries. All rights reserved.</p>
        <p className="mt-1">DEEPCAL ROUTEVERSE • Version 1.0.0</p>
      </div>
    </div>
  );
};

export default AboutSection;
