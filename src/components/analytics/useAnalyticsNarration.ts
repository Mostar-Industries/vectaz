import useChatterboxVoice from '@/hooks/useChatterboxVoice';
import { CountryPerformance } from './types';

export const useAnalyticsNarration = () => {
  const { speak } = useChatterboxVoice();

  const narrateAnalytics = (countries: CountryPerformance[]) => {
    const narration = generateAnalyticsNarration(countries);
    speak(narration);
  };

  const generateAnalyticsNarration = (countries: CountryPerformance[]): string => {
    const totalShipments = countries.reduce((acc, cur) => acc + cur.totalShipments, 0);
    const avgDelay = countries.reduce((sum, c) => sum + (c.avgDelayDays || 0), 0) / countries.length;
    const totalCost = countries.reduce((acc, cur) => acc + (cur.totalCost || 0), 0);
    
    const worstCountry = countries.reduce((worst, current) => 
      (current.avgDelayDays || 0) > (worst.avgDelayDays || 0) ? current : worst
    );
    
    const bestCountry = countries.reduce((best, current) => 
      (current.avgDelayDays || 0) < (best.avgDelayDays || 0) ? current : best
    );

    let narration = `Analytics summary: ${totalShipments} shipments across ${countries.length} countries. `;
    
    if (avgDelay > 3) {
      narration += `Warning: High average delay of ${avgDelay.toFixed(1)} days. `;
      narration += `The most problematic is ${worstCountry.country} with ${worstCountry.avgDelayDays} days. `;
    } else {
      narration += `Average delay is ${avgDelay.toFixed(1)} days. `;
    }
    
    narration += `${bestCountry.country} has the best performance at ${bestCountry.avgDelayDays} days. `;
    narration += `Total operational cost is ${totalCost.toLocaleString()} dollars.`;
    
    return narration;
  };

  return { narrateAnalytics };
};
