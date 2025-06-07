
import React, { useState, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { getForwarderRankings } from '@/services/deepEngine';
import DeepCALSpinner from './DeepCALSpinner';
import { speakText } from '@/services/voice/VoiceService';
import QuoteInputForm from './deepcal/QuoteInputForm';
import AnalysisResults from './deepcal/AnalysisResults';
import { QuoteData, ForwarderScore, WeightFactors, DeepCALProps } from './deepcal/types';
import { VoicePersonality } from '@/types/voice';

const DeepCALSection: React.FC<DeepCALProps> = ({ 
  voicePersonality = 'sassy' as VoicePersonality,
  voiceEnabled = true 
}) => {
  const { shipmentData } = useBaseDataStore();
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [source, setSource] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [weightKg, setWeightKg] = useState<number>(0);
  const [mode, setMode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ForwarderScore[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [weightFactors, setWeightFactors] = useState<WeightFactors>({
    cost: 0.4,
    time: 0.3,
    reliability: 0.3
  });

  const analyzeQuotes = (
    quotes: QuoteData[], 
    sourceCountry: string, 
    destCountry: string, 
    shipmentWeight: number, 
    shipmentMode: string,
    factors: WeightFactors
  ) => {
    setQuotes(quotes);
    setSource(sourceCountry);
    setDestination(destCountry);
    setWeightKg(shipmentWeight);
    setMode(shipmentMode);
    setWeightFactors(factors);
    setLoading(true);
    
    setTimeout(() => {
      try {
        const rankings = getForwarderRankings(factors);
        
        const filteredRankings = rankings
          .filter(r => quotes.some(q => q.forwarder.toLowerCase().includes(r.forwarder.toLowerCase()) || 
                                    r.forwarder.toLowerCase().includes(q.forwarder.toLowerCase())))
          .sort((a, b) => b.score - a.score);
        
        setResults(filteredRankings);
        setShowResults(true);
        setLoading(false);
        
        // Speak a success message when analysis is complete
        if (filteredRankings.length > 0) {
          const topForwarder = filteredRankings[0]?.forwarder || "Unknown";
          if (voiceEnabled) {
            speakText(`I have completed my analysis. Based on your preferences, ${topForwarder} is the optimal choice for your shipment from ${sourceCountry} to ${destCountry}.`, voicePersonality);
          }
        } else {
          if (voiceEnabled) {
            speakText("Analysis complete. I couldn't find a perfect match, but I've ranked the options based on your criteria.", voicePersonality);
          }
        }
        
      } catch (error) {
        console.error("Error calculating rankings:", error);
        setLoading(false);
        
        // Speak an error message
        if (voiceEnabled) {
          speakText("I encountered an error while analyzing the quotes. Please try again or check your input data.", voicePersonality);
        }
      }
    }, 2000);
  };

  const handleNewAnalysis = () => {
    setShowResults(false);
  };

  // Dynamic voice feedback based on component state
  useEffect(() => {
    if (voiceEnabled) {
      if (!showResults && !loading) {
        // Welcome message when first entering the component
        const welcomeMessage = "Welcome to DeepCAL Optimizer. Enter your freight quotes, and I'll analyze them for the best logistics options.";
        speakText(welcomeMessage, voicePersonality);
      } else if (showResults && results.length > 0) {
        // Speak a detailed analysis when viewing results
        const analysisMessage = `Analysis complete. I've identified ${results.length} suitable options for your ${weightKg}kg shipment from ${source} to ${destination}.`;
        speakText(analysisMessage, voicePersonality);
      }
    }
  }, [voiceEnabled, voicePersonality, showResults, loading, results.length]);
  
  // Speak feedback when user returns to the form
  useEffect(() => {
    if (!showResults && quotes.length > 0 && voiceEnabled) {
      speakText("Ready for a new analysis. Please enter your updated shipping requirements.", voicePersonality);
    }
  }, [showResults, quotes.length, voiceEnabled, voicePersonality]);

  return (
    <div className="container mx-auto py-8 max-w-7xl relative z-20">
      {!showResults ? (
        <QuoteInputForm 
          onAnalyze={analyzeQuotes}
          loading={loading}
        />
      ) : (
        <AnalysisResults 
          results={results}
          source={source}
          destination={destination}
          weightKg={weightKg}
          mode={mode}
          weightFactors={weightFactors}
          shipmentCount={shipmentData.length}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
    </div>
  );
};

export default DeepCALSection;
