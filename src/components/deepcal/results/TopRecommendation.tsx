
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ForwarderScore } from '../types';

interface TopRecommendationProps {
  topResult: ForwarderScore;
}

const TopRecommendation: React.FC<TopRecommendationProps> = ({ topResult }) => {
  return (
    <Card className="bg-gradient-to-br from-[#0A1A2F]/90 to-[#0A1A2F]/70 shadow-lg border border-[#00FFD1]/20">
      <CardHeader>
        <CardTitle className="text-xl text-[#00FFD1]">Top Recommendation</CardTitle>
        <CardDescription className="text-gray-300">Based on your preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-[#00FFD1]">
            {topResult?.forwarder || "No recommendation available"}
          </div>
          
          <div className="text-2xl text-white">
            DeepScore™: {Math.round((topResult?.score || 0) * 100)}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-sm text-gray-400">Cost</div>
              <div className="text-xl font-semibold text-white">
                {Math.round((topResult?.costPerformance || 0) * 100)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Time</div>
              <div className="text-xl font-semibold text-white">
                {Math.round((topResult?.timePerformance || 0) * 100)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Reliability</div>
              <div className="text-xl font-semibold text-white">
                {Math.round((topResult?.reliabilityPerformance || 0) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopRecommendation;
