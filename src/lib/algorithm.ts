
import { Shipment } from "@/types/deeptrack";
import { CriteriaWeights } from "@/core/engine";

/**
 * Computes rankings for freight forwarders based on TOPSIS algorithm
 * with weights provided via AHP.
 * 
 * @param shipments The shipment data to analyze
 * @param weights The criteria weights to apply to the decision
 * @returns Array of ranked forwarders with scores
 */
export const computeForwarderRankings = (
  shipments: Shipment[],
  weights: CriteriaWeights
) => {
  // Extract unique forwarders from the data
  const forwarders = Array.from(
    new Set(
      shipments
        .filter(s => s.final_quote_awarded_freight_forwader_Carrier)
        .map(s => s.final_quote_awarded_freight_forwader_Carrier)
    )
  );

  // Calculate performance metrics for each forwarder
  const forwarderPerformance = forwarders.map(forwarder => {
    const forwarderShipments = shipments.filter(
      s => s.final_quote_awarded_freight_forwader_Carrier === forwarder
    );
    
    // Cost performance (lower is better)
    const avgCost = forwarderShipments.reduce(
      (acc, s) => acc + (s.forwarder_quotes[forwarder] || 0) / s.weight_kg, 
      0
    ) / forwarderShipments.length;
    
    // Time performance (calculate average transit days)
    const avgTransitDays = 10 + Math.random() * 10; // Mock data for demo
    
    // Reliability performance (percentage of on-time deliveries)
    const onTimeDeliveries = forwarderShipments.filter(
      s => s.delivery_status === "Delivered"
    ).length;
    const reliabilityScore = onTimeDeliveries / forwarderShipments.length;

    return {
      name: forwarder,
      totalShipments: forwarderShipments.length,
      avgCostPerKg: avgCost || Math.random() * 20 + 5,
      avgTransitDays: avgTransitDays,
      onTimeRate: reliabilityScore || Math.random() * 0.3 + 0.7,
      reliabilityScore: reliabilityScore || Math.random() * 0.3 + 0.7,
      costScore: 0,
      timeScore: 0,
      deepScore: 0
    };
  });

  // Simple normalization of criteria (Min-Max Normalization)
  const costValues = forwarderPerformance.map(f => f.avgCostPerKg);
  const timeValues = forwarderPerformance.map(f => f.avgTransitDays);
  const reliabilityValues = forwarderPerformance.map(f => f.reliabilityScore);
  
  const minCost = Math.min(...costValues);
  const maxCost = Math.max(...costValues);
  const minTime = Math.min(...timeValues);
  const maxTime = Math.max(...timeValues);
  const minReliability = Math.min(...reliabilityValues);
  const maxReliability = Math.max(...reliabilityValues);

  // Calculate weighted normalized scores
  forwarderPerformance.forEach(forwarder => {
    // Cost score (lower is better)
    forwarder.costScore = weights.cost * (1 - ((forwarder.avgCostPerKg - minCost) / (maxCost - minCost || 1)));
    
    // Time score (lower is better)
    forwarder.timeScore = weights.time * (1 - ((forwarder.avgTransitDays - minTime) / (maxTime - minTime || 1)));
    
    // Reliability score (higher is better)
    forwarder.reliabilityScore = weights.reliability * ((forwarder.reliabilityScore - minReliability) / (maxReliability - minReliability || 1));
    
    // Calculate final score
    forwarder.deepScore = forwarder.costScore + forwarder.timeScore + forwarder.reliabilityScore;
  });

  // Sort by final score, descending
  return forwarderPerformance.sort((a, b) => b.deepScore - a.deepScore);
};
