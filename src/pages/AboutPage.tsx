import React from "react";
import { GlassContainer } from '@/components/ui/glass-effects';
import AnimatedBackground from '@/components/home/AnimatedBackground';

const AboutPage: React.FC = () => {
  return (
    <div className="h-screen w-full overflow-x-hidden relative bg-[#0A1A2F]">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-[#0A1A2F] z-0" />
      <div className="relative z-10 w-full pt-16 px-4">
        <div className="max-w-3xl mx-auto">
          <GlassContainer className="mb-6 p-4">
            <h1 className="text-2xl font-bold text-center text-[#00FFD1]">About DeepCAL Mission Optimizer</h1>
            <p className="text-sm text-center text-gray-400 mt-2">
              DeepCAL is an ultra-futuristic logistics optimization engine built to revolutionize humanitarian supply chains with real-time analytics, advanced AI, and immersive user experience.
            </p>
          </GlassContainer>
          <div className="bg-[#131C2B] rounded-lg p-6 border border-[#00FFD1]/10 shadow-md mt-4">
            <h2 className="text-[#00FFD1] text-lg mb-2">Our Mission</h2>
            <p className="text-gray-400 mb-2">Empowering organizations to make data-driven decisions, optimize routes, and enhance resilience across global supply networks.</p>
            <h2 className="text-[#00FFD1] text-lg mt-4 mb-2">Key Features</h2>
            <ul className="list-disc pl-6 text-gray-400">
              <li>Real-time shipment tracking and analytics</li>
              <li>AI-powered route and forwarder optimization</li>
              <li>Immersive, glass-inspired ultra-modern UI</li>
              <li>Secure, scalable cloud-native architecture</li>
            </ul>
            <h2 className="text-[#00FFD1] text-lg mt-4 mb-2">Contact & Credits</h2>
            <p className="text-gray-400">Built by Mostar Industries & Sector X. For feedback or collaboration, contact the engineering team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
