
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Info, 
  Globe, 
  Zap, 
  Shield, 
  Cpu, 
  BarChart4, 
  TrendingUp, 
  Radar, 
  LineChart, 
  MessageSquare 
} from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gradient-primary flex items-center">
        <Info className="mr-2 h-8 w-8" />
        About DeepCAL
      </h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>DeepCAL: Revolutionizing Logistics with Intelligent Analytics</CardTitle>
          <CardDescription>Powered by Mostar Industries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              In today's hyper-competitive global marketplace, logistics isn't just about tracking; it's about 
              predicting success. Mostar Industries proudly presents DeepCAL: a transformative logistics intelligence 
              platform that empowers organizations to not only visualize but anticipate and optimize their entire 
              supply chain. Move beyond reactive monitoring and unlock unprecedented levels of efficiency, resilience, 
              and profitability.
            </p>
            <h3 className="mt-6 mb-2 font-bold text-xl">Conquer Uncertainty. Optimize Your Supply Chain.</h3>
            <p>
              DeepCAL goes beyond basic risk assessment by using a powerful combination of Neutrosophic AHP and 
              TOPSIS. This innovative approach allows DeepCAL to account for the uncertainty and incomplete information 
              that's common in logistics, resulting in more accurate and reliable risk predictions. With DeepCAL, you 
              can make better decisions, minimize disruptions, and optimize your supply chain with confidence.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4">Scientific Foundation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-blue-400/20 bg-blue-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Radar className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle className="text-blue-600 dark:text-blue-400">Neutrosophic AHP</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              DeepCAL harnesses the power of Neutrosophic AHP (Analytic Hierarchy Process) to confidently handle 
              the inherent ambiguities and incomplete data that plague logistics. This allows for insightful risk 
              assessments, even in the most volatile and complex global environments.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-400/20 bg-purple-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <CardTitle className="text-purple-600 dark:text-purple-400">TOPSIS Methodology</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              DeepCAL leverages TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) to 
              systematically rank alternatives against ideal and anti-ideal benchmarks. This empowers your team 
              to make data-driven choices that maximize efficiency and minimize costs – from selecting the optimal 
              freight forwarder to dynamically optimizing routes.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Key Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-emerald-400/20 bg-emerald-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Globe className="h-5 w-5 text-emerald-500" />
              </div>
              <CardTitle className="text-emerald-600 dark:text-emerald-400">Real-Time Shipment Mapping</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gain a bird's-eye view of your global logistics network with our dynamic, interactive map. Track shipments, 
              monitor progress, and gain instant clarity and comprehensive oversight.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-400/20 bg-blue-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle className="text-blue-600 dark:text-blue-400">DeepTalk AI Assistant</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ask DeepCAL anything. Our intelligent chatbot provides immediate access to data-driven insights and answers, 
              simplifying complex queries and accelerating decision-making.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-400/20 bg-amber-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <BarChart4 className="h-5 w-5 text-amber-500" />
              </div>
              <CardTitle className="text-amber-600 dark:text-amber-400">Advanced Analytics Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Dive deep into critical performance indicators, identify hidden bottlenecks, and pinpoint areas for 
              operational improvement with our interactive visualizations.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-red-400/20 bg-red-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <CardTitle className="text-red-600 dark:text-red-400">Predictive Risk Assessment</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Proactively identify and mitigate potential delays, disruptions, and cost overruns before they impact 
              your bottom line. Stay ahead of the curve with DeepCAL's intelligent risk forecasting.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-indigo-400/20 bg-indigo-50/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <LineChart className="h-5 w-5 text-indigo-500" />
              </div>
              <CardTitle className="text-indigo-600 dark:text-indigo-400">Comparative Rate Calculator</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Evaluate freight forwarder options with unparalleled precision, ensuring cost-effectiveness and 
              optimized resource allocation. Make informed decisions, every time.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Real-World Results</h2>
      
      <Card className="mb-8 border-green-400/20 bg-green-50/10">
        <CardContent className="pt-6">
          <p className="text-muted-foreground italic">
            "DeepCAL has helped our clients reduce shipping delays by an average of 15% and save up to 10% on freight costs."
          </p>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4">Unlock Unprecedented Value</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data-Driven Precision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Move beyond gut feelings and make informed decisions based on verifiable, data-backed insights.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proactive Risk Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stay one step ahead of potential disruptions and proactively mitigate costly delays and disruptions.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Unrivaled Cost Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Identify and eliminate inefficiencies, streamline operations, and secure the most competitive rates.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Holistic Supply Chain Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gain a comprehensive, real-time understanding of your entire logistics ecosystem, from origin to destination.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Mostar Industries: Engineering Logistics Excellence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Mostar Industries is at the forefront of transforming the logistics and supply chain landscape. 
            DeepCAL embodies our dedication to providing our clients with innovative solutions that drive 
            measurable business outcomes. We are committed to empowering organizations to thrive in the 
            modern global economy.
          </p>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Card className="inline-block mb-8 bg-primary text-primary-foreground">
          <CardContent className="py-6 px-8">
            <h3 className="text-xl font-bold mb-2">Ready to Transform Your Logistics?</h3>
            <p>Request a Personalized DeepCAL Demo Today!</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-12">
        <p>© {new Date().getFullYear()} Mostar Industries. All rights reserved.</p>
        <p className="mt-1">DEEPCAL ROUTEVERSE • PRIME ORIGIN PROTOCOL</p>
      </div>
    </div>
  );
};

export default AboutSection;
