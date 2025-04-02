
import React, { useState, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { getForwarderRankings } from '@/services/deepEngine';
import DeepCALSpinner from './DeepCALSpinner';
import { speakText } from './deepcal/VoiceService';
import QuoteInputForm from './deepcal/QuoteInputForm';
import AnalysisResults from './deepcal/AnalysisResults';
import { QuoteData, ForwarderScore, WeightFactors, DeepCALProps } from './deepcal/types';

const DeepCALSection: React.FC<DeepCALProps> = ({ 
  voicePersonality = 'sassy',
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
          speakText(`I have completed my analysis. Based on your preferences, ${topForwarder} is the optimal choice for your shipment from ${sourceCountry} to ${destCountry}.`, voicePersonality, voiceEnabled);
        } else {
          speakText("Analysis complete. I couldn't find a perfect match, but I've ranked the options based on your criteria.", voicePersonality, voiceEnabled);
        }
        
      } catch (error) {
        console.error("Error calculating rankings:", error);
        setLoading(false);
        
        // Speak an error message
        speakText("I encountered an error while analyzing the quotes. Please try again or check your input data.", voicePersonality, voiceEnabled);
      }
    }, 2000);
  };

  const handleNewAnalysis = () => {
    setShowResults(false);
  };

  // Speak welcome message on component mount
  useEffect(() => {
    if (voiceEnabled) {
      const welcomeMessage = "Welcome to DeepCAL Optimizer. Enter your freight quotes, and I'll analyze them for the best logistics options.";
      speakText(welcomeMessage, voicePersonality, voiceEnabled);
    }
  }, [voiceEnabled, voicePersonality]);

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
