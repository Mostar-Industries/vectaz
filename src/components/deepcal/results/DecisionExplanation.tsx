
import React, { useEffect } from 'react';
import { ForwarderScore } from '../types';
import { speakText } from '@/services/voice/VoiceService';
import { useVoiceSettings } from '@/context/VoiceSettingsContext';

interface DecisionExplanationProps {
  topResult: ForwarderScore;
  source: string;
  destination: string;
  weightFactors: {
    cost: number;
    time: number;
    reliability: number;
  };
}

const DecisionExplanation: React.FC<DecisionExplanationProps> = ({ 
  topResult, 
  source, 
  destination, 
  weightFactors 
}) => {
  const { settings } = useVoiceSettings();
  
  // Generate detailed explanation for the decision
  const getDetailedExplanation = () => {
    const costFactor = Math.round(weightFactors.cost * 100);
    const timeFactor = Math.round(weightFactors.time * 100);
    const reliabilityFactor = Math.round(weightFactors.reliability * 100);
    
    const strongestFactor = [
      { name: 'cost', value: topResult?.costPerformance || 0 },
      { name: 'time', value: topResult?.timePerformance || 0 },
      { name: 'reliability', value: topResult?.reliabilityPerformance || 0 }
    ].sort((a, b) => b.value - a.value)[0].name;
    
    return `${topResult?.forwarder} has been selected as your optimal shipping partner with a DeepScore of ${Math.round((topResult?.score || 0) * 100)}. 
    This recommendation is based on your preference weights of ${costFactor}% for cost, ${timeFactor}% for time, and ${reliabilityFactor}% for reliability. 
    ${topResult?.forwarder} demonstrates particularly strong ${strongestFactor} performance on the ${source}-${destination} route.`;
  };
  
  // Speak the explanation when the component mounts
  useEffect(() => {
    if (settings.enabled && topResult) {
      const explanation = getDetailedExplanation();
      // Use a small timeout to prevent overlapping with the main analysis result speech
      const timer = setTimeout(() => {
        speakText(explanation, settings.personality);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [topResult?.forwarder, settings.enabled]);
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4 text-[#00FFD1]">Decision Explanation</h3>
      <div className="p-4 bg-[#0A1A2F]/60 border border-[#00FFD1]/10 rounded-lg text-xs sm:text-sm space-y-3 text-gray-300">
        <p>
          <strong className="text-white">{topResult?.forwarder}</strong> is recommended as the optimal choice for your shipment based on a comprehensive analysis that considers cost, time efficiency, and reliability factors.
        </p>
        <p>
          This forwarder demonstrates excellent {topResult?.reliabilityPerformance > 0.8 ? "reliability" : "cost-effectiveness"} on the {source}-{destination} route, with historical data showing consistently strong performance across similar shipments.
        </p>
        <p>
          Your preference weight of {Math.round(weightFactors.cost * 100)}% for cost, {Math.round(weightFactors.time * 100)}% for time, and {Math.round(weightFactors.reliability * 100)}% for reliability was applied to the calculation.
        </p>
      </div>
    </div>
  );
};

export default DecisionExplanation;
