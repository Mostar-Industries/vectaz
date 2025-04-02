
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PrimeOriginExplanation } from './about/PrimeOriginExplanation';
import { getPrimeOriginExplanation } from '@/services/systemExplanation';
import { motion } from 'framer-motion';
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
  MessagesSquare,
  Microscope,
  Sparkles
} from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

// Animated Feature Card Component
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,255,209,0.15)" }}
      className="border border-[#00FFD1]/20 rounded-lg overflow-hidden bg-gradient-to-b from-black/70 to-slate-900/70 backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-3 p-2 rounded-full bg-[#00FFD1]/10 text-[#00FFD1]">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-[#00FFD1]">{title}</h3>
        </div>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
};

// Animated Stats Counter
const AnimatedStat = ({ value, label, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000; // ms
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCount(Math.floor(progress * value));
      
      if (frame === totalFrames) {
        clearInterval(timer);
        setCount(value);
      }
    }, frameDuration);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <div className="text-center">
      <div className="text-4xl font-bold bg-gradient-to-r from-[#00FFD1] to-[#00BFFF] text-transparent bg-clip-text">
        {prefix}{count}{suffix}
      </div>
      <div className="text-gray-400 mt-2">{label}</div>
    </div>
  );
};

const AboutSection: React.FC = () => {
  const primeOriginProtocol = getPrimeOriginExplanation();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#00FFD1] to-[#00BFFF] text-transparent bg-clip-text">
          DeepCAL: Revolutionizing Logistics with Intelligent Analytics
        </h1>
        <p className="text-muted-foreground mt-2">Powered by Mostar Industries</p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-3xl mx-auto mt-6"
        >
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
        </motion.div>
      </motion.div>
      
      {/* Animated Stats Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 px-4"
      >
        <AnimatedStat value={15} suffix="%" label="Reduced Shipping Delays" />
        <AnimatedStat value={10} suffix="%" label="Average Cost Savings" />
        <AnimatedStat value={9823} label="Simulation Cases" />
        <AnimatedStat value={99.8} suffix="%" label="Decision Accuracy" />
      </motion.div>
      
      <PrimeOriginExplanation protocol={primeOriginProtocol} />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-2 gap-6 mt-12"
      >
        <motion.div variants={itemVariants}>
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
        </motion.div>
        
        <motion.div variants={itemVariants}>
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
        </motion.div>
      </motion.div>
      
      <Separator className="my-12 bg-gradient-to-r from-transparent via-[#00FFD1]/30 to-transparent" />
      
      <div className="mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-[#00FFD1] to-[#00BFFF] text-transparent bg-clip-text"
        >
          Key Features: From Real-Time Visibility to Predictive Power
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          DeepCAL seamlessly integrates real-time visualization, predictive modeling, and actionable recommendations.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<GlobeIcon className="h-5 w-5" />}
            title="Real-Time Mapping"
            description="Track shipments, monitor progress, and gain instant clarity with our dynamic, interactive global logistics network map."
            delay={0.1}
          />
          
          <FeatureCard 
            icon={<MessagesSquare className="h-5 w-5" />}
            title="DeepTalk AI Assistant"
            description="Ask DeepCAL anything. Our intelligent chatbot provides immediate access to data-driven insights and answers."
            delay={0.2}
          />
          
          <FeatureCard 
            icon={<LineChart className="h-5 w-5" />}
            title="Advanced Analytics"
            description="Dive deep into critical performance indicators, identify hidden bottlenecks, and pinpoint areas for operational improvement."
            delay={0.3}
          />
          
          <FeatureCard 
            icon={<History className="h-5 w-5" />}
            title="Predictive Risk Assessment"
            description="Proactively identify and mitigate potential delays, disruptions, and cost overruns before they impact your bottom line."
            delay={0.4}
          />
          
          <FeatureCard 
            icon={<DollarSign className="h-5 w-5" />}
            title="Comparative Rate Calculator"
            description="Evaluate freight forwarder options with unparalleled precision, ensuring cost-effectiveness and optimized resource allocation."
            delay={0.5}
          />
          
          <FeatureCard 
            icon={<BrainCircuit className="h-5 w-5" />}
            title="Scientific Decision Support"
            description="DeepCAL uses Neutrosophic AHP and TOPSIS to account for uncertainty and incomplete information in logistics."
            delay={0.6}
          />
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-slate-900 to-blue-900/30 p-8 rounded-lg mb-12 border border-[#00FFD1]/20"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#00FFD1]">Real-World Results</h2>
        <p className="text-center text-lg">
          DeepCAL has helped our clients reduce shipping delays by an average of <span className="font-bold text-[#00FFD1]">15%</span> and save up to <span className="font-bold text-[#00FFD1]">10%</span> on freight costs through 
          optimized route selection and carrier choice, powered by our Neutrosophic AHP-TOPSIS methodology.
        </p>
        <p className="text-center text-sm mt-2 text-gray-400 italic">
          And no, we didn't just make up these numbers to sound impressive. Our data scientists would quit if we did that.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-[#00FFD1] to-[#00BFFF] text-transparent bg-clip-text">
          Unlock Unprecedented Value
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
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
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
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
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
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
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
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
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
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
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-[#00FFD1] to-[#00BFFF] text-transparent bg-clip-text">
          Ready to Transform Your Logistics?
        </h2>
        <p className="mb-6">Request a Personalized DeepCAL Demo Today!</p>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-[#00FFD1] to-[#00BFFF] text-black font-bold rounded-full hover:shadow-[0_0_15px_rgba(0,255,209,0.5)]"
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AboutSection;
