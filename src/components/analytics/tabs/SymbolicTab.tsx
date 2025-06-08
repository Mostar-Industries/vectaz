import React from 'react';
import { GlassContainer } from '@/components/ui/glass-effects';

export default function SymbolicTab({ data }) {
  // Sample symbolic analysis data
  const symbolicData = {
    networkDensity: 0.87,
    pathOptimality: 0.92,
    robustness: 0.84,
    resilience: 0.79,
    adaptability: 0.76,
    systemComplexity: 0.82
  };
  
  // Model suggestions
  const modelSuggestions = [
    { action: "Route optimization through X-junction modal splits", impact: "12.4% potential efficiency increase", confidence: 0.94 },
    { action: "Carrier diversification in region B", impact: "8.7% risk reduction", confidence: 0.89 },
    { action: "Alternative port utilization strategy", impact: "7.2% transit time reduction", confidence: 0.82 },
    { action: "Dynamic allocation model implementation", impact: "15.6% cost reduction", confidence: 0.78 }
  ];

  // Calculate overall system score
  const systemScore = Object.values(symbolicData).reduce((sum, val) => sum + val, 0) / Object.values(symbolicData).length;
  const systemScorePercentage = (systemScore * 100).toFixed(1);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-xl font-semibold">Symbolic Analysis</h3>
        <div className="text-[#00FFD1] text-sm bg-[#0A1A2F]/80 px-3 py-1 rounded-full border border-[#00FFD1]/30">
          DeepCAL™ Augmented Logic
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <GlassContainer className="p-6">
          <div className="flex items-center mb-8">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" stroke="#1A2A3F" strokeWidth="12" fill="none" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="54" 
                  stroke="#00FFD1" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray="339.292"
                  strokeDashoffset={339.292 * (1 - systemScore)}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-white">{systemScorePercentage}%</span>
                <span className="text-xs text-gray-400">System Score</span>
              </div>
            </div>
            
            <div className="ml-8 flex-1">
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(symbolicData).map(([key, value]) => (
                  <div key={key} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm text-[#00FFD1]">{(value * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[#1A2A3F] rounded-full h-1.5">
                      <div 
                        className={`bg-[#00FFD1] h-1.5 rounded-full w-[${value * 100}%]`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-[#00FFD1] text-md font-semibold mb-4">DeepCAL Model Suggestions</h4>
            <div className="space-y-4">
              {modelSuggestions.map((suggestion, idx) => (
                <div key={idx} className="bg-[#0A1A2F]/80 p-4 rounded-lg border border-[#00FFD1]/20">
                  <div className="flex justify-between">
                    <div>
                      <h5 className="text-white font-medium mb-1">{suggestion.action}</h5>
                      <p className="text-sm text-[#00FFD1]">{suggestion.impact}</p>
                    </div>
                    <div className="bg-[#1A2A3F] px-3 py-1 h-fit rounded-full text-xs text-white">
                      {(suggestion.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
}
