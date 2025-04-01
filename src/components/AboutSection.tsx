
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PrimeOriginExplanation } from './about/PrimeOriginExplanation';
import { getPrimeOriginExplanation } from '@/services/systemExplanation';
import { 
  BrainCircuit, 
  FlaskConical, 
  Calculator, 
  Scale, 
  Lightbulb, 
  Rocket, 
  LineChart, 
  History, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  GlobeIcon, 
  MessagesSquare
} from 'lucide-react';

const AboutSection: React.FC = () => {
  const primeOriginProtocol = getPrimeOriginExplanation();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#00FFD1] to-[#00BFFF] text-transparent bg-clip-text">
          DeepCAL: Revolutionizing Logistics with Intelligent Analytics
        </h1>
        <p className="text-muted-foreground mt-2">Powered by Mostar Industries</p>
        
        <div className="max-w-3xl mx-auto mt-6">
          <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-300 text-transparent bg-clip-text">
            Conquer Uncertainty. Optimize Your Supply Chain.
          </h2>
          <p className="text-lg mb-6">
            In today's hyper-competitive global marketplace, logistics isn't just about tracking; it's about 
            <span className="text-[#00FFD1] font-semibold"> predicting success</span>. 
            Mostar Industries proudly presents DeepCAL: a transformative logistics intelligence platform that empowers organizations 
            to not only visualize but anticipate and optimize their entire supply chain. Move beyond reactive monitoring and unlock 
            unprecedented levels of efficiency, resilience, and profitability.
          </p>
        </div>
      </div>
      
      <PrimeOriginExplanation protocol={primeOriginProtocol} />
      
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Card className="border border-purple-500/20 hover:shadow-[0_0_15px_rgba(160,90,255,0.2)] transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-purple-900/30">
            <CardTitle className="flex items-center">
              <FlaskConical className="h-5 w-5 mr-2 text-purple-400" /> 
              <span className="bg-gradient-to-r from-purple-400 to-pink-300 text-transparent bg-clip-text">
                Neutrosophic AHP
              </span>
            </CardTitle>
            <CardDescription className="text-purple-200/70">Navigating Uncertainty</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              DeepCAL harnesses the power of Neutrosophic AHP to confidently handle the inherent ambiguities and incomplete 
              data that plague logistics. This allows for insightful risk assessments, even in the most volatile and complex 
              global environments. <span className="text-purple-400 italic">And yes, we know "Neutrosophic" isn't a word you use at dinner parties.</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,255,209,0.2)] transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-cyan-900/30">
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-cyan-400" />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-300 text-transparent bg-clip-text">
                TOPSIS
              </span>
            </CardTitle>
            <CardDescription className="text-cyan-200/70">Technique for Order Preference by Similarity to Ideal Solution</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              DeepCAL leverages TOPSIS to systematically rank alternatives against ideal and anti-ideal benchmarks. 
              This empowers your team to make data-driven choices that maximize efficiency and minimize costs – from 
              selecting the optimal freight forwarder to dynamically optimizing routes. <span className="text-cyan-400 italic">It's basically math that tells you which option sucks the least!</span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-12 bg-gradient-to-r from-transparent via-[#00FFD1]/30 to-transparent" />
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-[#00FFD1] to-[#00BFFF] text-transparent bg-clip-text">
          Key Features: From Real-Time Visibility to Predictive Power
        </h2>
        <p className="text-center mb-8">
          DeepCAL seamlessly integrates real-time visualization, predictive modeling, and actionable recommendations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border border-blue-500/20 hover:shadow-[0_0_10px_rgba(0,191,255,0.15)] transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GlobeIcon className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-blue-400">Real-Time Shipment Mapping</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Gain a bird's-eye view of your global logistics network with our dynamic, interactive map. Track shipments, 
                monitor progress, and gain instant clarity and comprehensive oversight. <span className="text-blue-300 italic text-xs">It's like Google Maps, but for your cargo, and without the annoying "recalculating" voice.</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-green-500/20 hover:shadow-[0_0_10px_rgba(0,255,128,0.15)] transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessagesSquare className="h-5 w-5 mr-2 text-green-400" />
                <span className="text-green-400">DeepTalk AI-Powered Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Ask DeepCAL anything. Our intelligent chatbot provides immediate access to data-driven insights and answers, 
                simplifying complex queries and accelerating decision-making. <span className="text-green-300 italic text-xs">Like having a logistics PhD in your pocket, but with better jokes.</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-amber-500/20 hover:shadow-[0_0_10px_rgba(255,191,0,0.15)] transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-amber-400" />
                <span className="text-amber-400">Advanced Analytics Dashboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Dive deep into critical performance indicators, identify hidden bottlenecks, and pinpoint areas for operational 
                improvement with our interactive visualizations. <span className="text-amber-300 italic text-xs">Making beautiful charts that actually mean something – a true innovation!</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-red-500/20 hover:shadow-[0_0_10px_rgba(255,64,64,0.15)] transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2 text-red-400" />
                <span className="text-red-400">Predictive Risk Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Proactively identify and mitigate potential delays, disruptions, and cost overruns before they impact 
                your bottom line. Stay ahead of the curve with DeepCAL's intelligent risk forecasting. <span className="text-red-300 italic text-xs">We're basically logistics fortune-tellers, but with algorithms instead of crystal balls.</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-yellow-500/20 hover:shadow-[0_0_10px_rgba(255,191,0,0.15)] transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-yellow-400" />
                <span className="text-yellow-400">Comparative Rate Calculator</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Evaluate freight forwarder options with unparalleled precision, ensuring cost-effectiveness and optimized 
                resource allocation. Make informed decisions, every time. <span className="text-yellow-300 italic text-xs">Find out who's trying to overcharge you, scientifically.</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-purple-500/20 hover:shadow-[0_0_10px_rgba(160,90,255,0.15)] transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BrainCircuit className="h-5 w-5 mr-2 text-purple-400" />
                <span className="text-purple-400">Scientific Decision Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                DeepCAL goes beyond basic risk assessment by using a powerful combination of Neutrosophic AHP and TOPSIS. 
                This innovative approach allows DeepCAL to account for the uncertainty and incomplete information that's common 
                in logistics, resulting in more accurate and reliable risk predictions. <span className="text-purple-300 italic text-xs">We put the "science" in "logistics science" – someone had to do it.</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-slate-900 to-blue-900/30 p-8 rounded-lg mb-12 border border-[#00FFD1]/20">
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#00FFD1]">Real-World Results</h2>
        <p className="text-center text-lg">
          DeepCAL has helped our clients reduce shipping delays by an average of <span className="font-bold text-[#00FFD1]">15%</span> and save up to <span className="font-bold text-[#00FFD1]">10%</span> on freight costs through 
          optimized route selection and carrier choice, powered by our Neutrosophic AHP-TOPSIS methodology.
        </p>
        <p className="text-center text-sm mt-2 text-gray-400 italic">
          And no, we didn't just make up these numbers to sound impressive. Our data scientists would quit if we did that.
        </p>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-[#00FFD1] to-[#00BFFF] text-transparent bg-clip-text">
          Unlock Unprecedented Value
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-teal-500/20 hover:shadow-[0_0_10px_rgba(0,255,209,0.15)] transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-teal-400" />
                <span className="text-teal-400">Data-Driven Precision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Move beyond gut feelings and make informed decisions based on verifiable, data-backed insights.
                <span className="block text-teal-300 italic text-xs mt-1">Because "my intuition says so" isn't a great strategy for multi-million dollar operations.</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-rose-500/20 hover:shadow-[0_0_10px_rgba(255,64,128,0.15)] transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-rose-400" />
                <span className="text-rose-400">Proactive Risk Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Stay one step ahead of potential disruptions and proactively mitigate costly delays and disruptions.
                <span className="block text-rose-300 italic text-xs mt-1">Think of us as the logistics equivalent of a weather forecast, but for supply chain storms.</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-amber-500/20 hover:shadow-[0_0_10px_rgba(255,191,0,0.15)] transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-amber-400" />
                <span className="text-amber-400">Unrivaled Cost Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Identify and eliminate inefficiencies, streamline operations, and secure the most competitive rates.
                <span className="block text-amber-300 italic text-xs mt-1">We help you save money without having to use those suspicious "discount" carriers nobody's ever heard of.</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-blue-500/20 hover:shadow-[0_0_10px_rgba(0,191,255,0.15)] transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GlobeIcon className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-blue-400">Holistic Supply Chain Visibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Gain a comprehensive, real-time understanding of your entire logistics ecosystem, from origin to destination.
                <span className="block text-blue-300 italic text-xs mt-1">Like having X-ray vision for your supply chain, but less creepy and more useful.</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-300 text-transparent bg-clip-text">
          Mostar Industries: Engineering Logistics Excellence
        </h2>
        <p className="max-w-3xl mx-auto">
          Mostar Industries is at the forefront of transforming the logistics and supply chain landscape. 
          DeepCAL embodies our dedication to providing our clients with innovative solutions that drive 
          measurable business outcomes. We are committed to empowering organizations to thrive in the modern global economy.
        </p>
        <p className="text-sm mt-2 text-gray-400 italic">
          Founded by people who got tired of explaining to their friends what logistics actually is.
        </p>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-[#00FFD1] to-[#00BFFF] text-transparent bg-clip-text">
          Ready to Transform Your Logistics?
        </h2>
        <p className="mb-6">Request a Personalized DeepCAL Demo Today!</p>
      </div>
    </div>
  );
};

export default AboutSection;
