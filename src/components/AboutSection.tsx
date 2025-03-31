
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PrimeOriginExplanation } from './about/PrimeOriginExplanation';
import { getPrimeOriginExplanation } from '@/services/systemExplanation';

const AboutSection: React.FC = () => {
  const primeOriginProtocol = getPrimeOriginExplanation();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight">DeepCAL: Revolutionizing Logistics with Intelligent Analytics</h1>
        <p className="text-muted-foreground mt-2">Powered by Mostar Industries</p>
        
        <div className="max-w-3xl mx-auto mt-6">
          <h2 className="text-2xl font-semibold mb-4">Conquer Uncertainty. Optimize Your Supply Chain.</h2>
          <p className="text-lg mb-6">
            In today's hyper-competitive global marketplace, logistics isn't just about tracking; it's about predicting success. 
            Mostar Industries proudly presents DeepCAL: a transformative logistics intelligence platform that empowers organizations 
            to not only visualize but anticipate and optimize their entire supply chain. Move beyond reactive monitoring and unlock 
            unprecedented levels of efficiency, resilience, and profitability.
          </p>
        </div>
      </div>
      
      <PrimeOriginExplanation protocol={primeOriginProtocol} />
      
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Neutrosophic AHP</CardTitle>
            <CardDescription>Navigating Uncertainty</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              DeepCAL harnesses the power of Neutrosophic AHP to confidently handle the inherent ambiguities and incomplete 
              data that plague logistics. This allows for insightful risk assessments, even in the most volatile and complex 
              global environments.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>TOPSIS</CardTitle>
            <CardDescription>Technique for Order Preference by Similarity to Ideal Solution</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              DeepCAL leverages TOPSIS to systematically rank alternatives against ideal and anti-ideal benchmarks. 
              This empowers your team to make data-driven choices that maximize efficiency and minimize costs – from 
              selecting the optimal freight forwarder to dynamically optimizing routes.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-12" />
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Key Features: From Real-Time Visibility to Predictive Power</h2>
        <p className="text-center mb-8">
          DeepCAL seamlessly integrates real-time visualization, predictive modeling, and actionable recommendations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Shipment Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Gain a bird's-eye view of your global logistics network with our dynamic, interactive map. Track shipments, 
                monitor progress, and gain instant clarity and comprehensive oversight.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>DeepTalk AI-Powered Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Ask DeepCAL anything. Our intelligent chatbot provides immediate access to data-driven insights and answers, 
                simplifying complex queries and accelerating decision-making.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Dive deep into critical performance indicators, identify hidden bottlenecks, and pinpoint areas for operational 
                improvement with our interactive visualizations.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Predictive Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Proactively identify and mitigate potential delays, disruptions, and cost overruns before they impact 
                your bottom line. Stay ahead of the curve with DeepCAL's intelligent risk forecasting.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Comparative Rate Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Evaluate freight forwarder options with unparalleled precision, ensuring cost-effectiveness and optimized 
                resource allocation. Make informed decisions, every time.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Scientific Decision Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                DeepCAL goes beyond basic risk assessment by using a powerful combination of Neutrosophic AHP and TOPSIS. 
                This innovative approach allows DeepCAL to account for the uncertainty and incomplete information that's common 
                in logistics, resulting in more accurate and reliable risk predictions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-muted p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">Real-World Results</h2>
        <p className="text-center text-lg">
          DeepCAL has helped our clients reduce shipping delays by an average of 15% and save up to 10% on freight costs through 
          optimized route selection and carrier choice, powered by our Neutrosophic AHP-TOPSIS methodology.
        </p>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Unlock Unprecedented Value</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Data-Driven Precision</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Move beyond gut feelings and make informed decisions based on verifiable, data-backed insights.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Proactive Risk Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Stay one step ahead of potential disruptions and proactively mitigate costly delays and disruptions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Unrivaled Cost Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Identify and eliminate inefficiencies, streamline operations, and secure the most competitive rates.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Holistic Supply Chain Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Gain a comprehensive, real-time understanding of your entire logistics ecosystem, from origin to destination.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4">Mostar Industries: Engineering Logistics Excellence</h2>
        <p className="max-w-3xl mx-auto">
          Mostar Industries is at the forefront of transforming the logistics and supply chain landscape. 
          DeepCAL embodies our dedication to providing our clients with innovative solutions that drive 
          measurable business outcomes. We are committed to empowering organizations to thrive in the modern global economy.
        </p>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Transform Your Logistics?</h2>
        <p className="mb-6">Request a Personalized DeepCAL Demo Today!</p>
      </div>
    </div>
  );
};

export default AboutSection;
