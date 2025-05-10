import type { Shipment } from '@/types/deeptrack';

export interface ScoreWeights {
  cost: number;
  time: number;
  reliability: number;
}

export interface ForwarderScore {
  forwarder: string;
  score: number;
  components: {
    costPerformance: number;
    timePerformance: number;
    reliabilityPerformance: number;
  };
  trace: {
    shipmentIds: string[];
    influentialFields: string[];
    commentary: string;
  };
}

export function getBaseWeights(): ScoreWeights {
  return {
    cost: 0.4,
    time: 0.3,
    reliability: 0.3
  };
}

const DEFAULT_WEIGHTS: ScoreWeights = getBaseWeights();

export function calculateForwarderScores(
  shipments: Shipment[],
  weights: ScoreWeights = DEFAULT_WEIGHTS
): ForwarderScore[] {
  // Group shipments by forwarder
  const forwarderMap = new Map<string, Shipment[]>();
  shipments.forEach(shipment => {
    const forwarder = shipment.carrier;
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, []);
    }
    forwarderMap.get(forwarder)?.push(shipment);
  });

  // Calculate scores for each forwarder
  return Array.from(forwarderMap.entries()).map(([forwarder, forwarderShipments]) => {
    const costPerformance = calculateCostPerformance(forwarderShipments);
    const timePerformance = calculateTimePerformance(forwarderShipments);
    const reliabilityPerformance = calculateReliabilityPerformance(forwarderShipments);

    const score = (
      weights.cost * costPerformance +
      weights.time * timePerformance +
      weights.reliability * reliabilityPerformance
    );

    return {
      forwarder,
      score,
      components: {
        costPerformance,
        timePerformance,
        reliabilityPerformance
      },
      trace: {
        shipmentIds: forwarderShipments.map(s => s.id || '').filter(Boolean),
        influentialFields: getInfluentialFields(forwarderShipments),
        commentary: generatePerformanceCommentary(forwarder, forwarderShipments)
      }
    };
  });
}

// Helper functions would be implemented here
function calculateCostPerformance(shipments: Shipment[]): number {
  /* Implementation */
  return 0.9; // Example
}

function calculateTimePerformance(shipments: Shipment[]): number {
  console.warn('[Phase 2] calculateTimePerformance stub called');
  return 0.8;
}

function calculateReliabilityPerformance(shipments: Shipment[]): number {
  console.warn('[Phase 2] calculateReliabilityPerformance stub called');
  return 0.9;
}

function getInfluentialFields(shipments: Shipment[]): string[] {
  console.warn('[Phase 2] getInfluentialFields stub called');
  return ['cost', 'delivery_days'];
}

function generatePerformanceCommentary(forwarder: string, shipments: Shipment[]): string {
  /* Implementation */
  return `${forwarder} ranked highly due to consistent performance on ${shipments.length} shipments`;
}
