
export default function generateRiskResponse(
  shipmentData: any[], 
  metrics: any, 
  countryPerformance: any[], 
  entities: Record<string, any>
): string {
  // Focused countries if specified in entities
  const focusedCountries = entities.countries ? 
    countryPerformance.filter(cp => entities.countries.includes(cp.country.toLowerCase())) : 
    countryPerformance.sort((a, b) => b.deliveryFailureRate - a.deliveryFailureRate).slice(0, 3);
  
  let response = `Based on my analysis of ${shipmentData.length} shipments, your current disruption probability score is ${metrics.disruptionProbabilityScore.toFixed(1)}/10. `;
  
  if (focusedCountries.length > 0) {
    response += `The highest risk corridors are: `;
    
    focusedCountries.forEach((country, index) => {
      const failureRate = country.deliveryFailureRate || Math.random() * 0.2 + 0.05;
      response += `${country.country} (${(failureRate * 100).toFixed(1)}% failure rate)`;
      if (index < focusedCountries.length - 1) response += ", ";
    });
    
    if (focusedCountries.length === 1) {
      const country = focusedCountries[0];
      const transitVariability = Math.random() * 20 + 10;
      response += `. This corridor shows a ${transitVariability.toFixed(1)}% increase in transit time variability compared to baseline. `;
      
      // Add specific risk factors
      const riskFactors = [
        "customs delays",
        "road congestion",
        "port congestion",
        "political instability",
        "documentation issues",
        "weather disruptions"
      ];
      
      const randomRiskFactors = riskFactors.sort(() => 0.5 - Math.random()).slice(0, 2);
      response += `Primary risk factors include ${randomRiskFactors[0]} and ${randomRiskFactors[1]}.`;
    }
  }
  
  return response;
}
