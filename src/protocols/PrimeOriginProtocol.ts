
/**
 * PRIME ORIGIN PROTOCOL
 * DeepCAL's formal decision procedure for forwarder & route ranking
 * Backed by Neutrosophic AHP → Weighted TOPSIS → Explanation
 */

import { loadBaseData, validateDataset } from '@/services/dataIntake';
import { computeNeutrosophicWeights } from '@/services/ahpModule';
import { applyTOPSIS, buildDecisionMatrix } from '@/services/topsisEngine';
import { logAuditTrail } from '@/services/auditLogger';
import { explainDecision } from '@/services/deepExplain';
import { ForwarderPerformance } from '@/types/deeptrack';

export interface PrimeOriginResult {
  forwarder: string;
  closenessCoefficient: number;
  sourceRows: string[];
  explanation: any;
  dataVersion: string;
  datasetHash: string;
  protocol: string;
}

export interface PrimeOriginMetadata {
  engine: string;
  data_version: string;
  hash: string;
  explanation_ready: boolean;
  protocol: string;
  computation_timestamp: string;
}

/**
 * The PRIME ORIGIN PROTOCOL is DeepCAL's formalized computational workflow for
 * logistics decision-making. It implements a traceable, scientific, and explainable
 * process combining Neutrosophic AHP and TOPSIS methodologies.
 */
export async function executePrimeOriginProtocol(
  datasetVersion: string = "latest"
): Promise<{
  results: PrimeOriginResult[];
  metadata: PrimeOriginMetadata;
}> {
  try {
    // Step 1: Load and validate dataset
    const { dataset, hash, metadata } = await loadBaseData(datasetVersion);
    
    if (!validateDataset(dataset)) {
      throw new Error('Invalid or incomplete data — cannot compute.');
    }
    
    // Step 2: Compute weights using Neutrosophic AHP
    const weights = computeNeutrosophicWeights();
    
    // Step 3: Derive forwarder performance from dataset
    const forwarderPerformance = deriveForwarderPerformance(dataset);
    
    // Step 4: Build the decision matrix using forwarder performance
    const decisionMatrix = buildDecisionMatrix(forwarderPerformance);
    
    // Step 5: Apply TOPSIS to generate rankings
    const rankings = applyTOPSIS(decisionMatrix, weights);
    
    // Step 6: Add explanations and protocol information
    const results: PrimeOriginResult[] = rankings.map(entry => ({
      forwarder: entry.forwarder,
      closenessCoefficient: entry.Ci,
      sourceRows: entry.sourceRows || [],
      explanation: explainDecision(entry),
      dataVersion: datasetVersion,
      datasetHash: hash,
      protocol: 'Prime Origin v1.0.0'
    }));
    
    // Step 7: Generate metadata for traceability
    const metadata: PrimeOriginMetadata = {
      engine: "Neutrosophic AHP-TOPSIS",
      data_version: datasetVersion,
      hash: hash,
      explanation_ready: results.every(r => r.explanation),
      protocol: "Prime Origin v1.0.0",
      computation_timestamp: new Date().toISOString()
    };
    
    // Step 8: Log the operation in audit trail
    logAuditTrail(
      'executePrimeOriginProtocol',
      { datasetVersion, forwarderCount: forwarderPerformance.length },
      { rankingsCount: results.length },
      { weights },
      datasetVersion,
      hash
    );
    
    return { results, metadata };
  } catch (error) {
    console.error("PRIME ORIGIN PROTOCOL execution failed:", error);
    throw error;
  }
}

// Helper function to derive forwarder performance from shipment data
function deriveForwarderPerformance(dataset: any[]): ForwarderPerformance[] {
  // Group shipments by forwarder
  const forwarderMap = new Map<string, any[]>();
  
  dataset.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, []);
    }
    forwarderMap.get(forwarder)?.push(shipment);
  });
  
  // Calculate performance metrics for each forwarder
  return Array.from(forwarderMap.entries())
    .filter(([name, _]) => name && name !== 'Hand carried' && name !== 'UNHAS')
    .map(([name, shipments]) => {
      const totalShipments = shipments.length;
      
      // Calculate average transit days
      const completedShipments = shipments.filter(s => 
        s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
      );
      
      const transitTimes = completedShipments.map(s => {
        const collectionDate = new Date(s.date_of_collection);
        const arrivalDate = new Date(s.date_of_arrival_destination);
        return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
      });
      
      const avgTransitDays = transitTimes.length > 0 
        ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
        : 0;
      
      // Calculate reliability score based on on-time rate
      const onTimeRate = completedShipments.length / Math.max(totalShipments, 1);
      const reliabilityScore = Math.min(1, Math.max(0, onTimeRate));
      
      // Calculate costs
      const costPerKgValues = shipments
        .filter(s => s.weight_kg > 0 && s.forwarder_quotes && s.forwarder_quotes[name.toLowerCase()])
        .map(s => s.forwarder_quotes[name.toLowerCase()] / s.weight_kg);
      
      const avgCostPerKg = costPerKgValues.length > 0
        ? costPerKgValues.reduce((sum, cost) => sum + cost, 0) / costPerKgValues.length
        : 0;
        
      // Calculate normalized scores for TOPSIS (higher is better)
      const costScore = avgCostPerKg > 0 ? 1 / avgCostPerKg : 0;
      const timeScore = avgTransitDays > 0 ? 1 / avgTransitDays : 0;
      
      return {
        name,
        totalShipments,
        avgCostPerKg,
        avgTransitDays,
        onTimeRate,
        reliabilityScore,
        costScore,
        timeScore,
        deepScore: (reliabilityScore + costScore + timeScore) / 3 * 100,
        id: name.toLowerCase().replace(/\s+/g, '_')
      };
    });
}
