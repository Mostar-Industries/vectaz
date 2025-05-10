import type { ForwarderScore, Shipment } from '@/types/deeptrack';
import { getBaseWeights } from './forwarderMetrics';
import { persistDriftLog } from '@/services/driftSync';

type DriftLog = {
  shipmentId: string;
  forwarder: string;
  predicted: ForwarderScore;
  actual: { deliveryDays: number; cost: number };
  driftMagnitude: number;
  weightAdjustment: Record<string, number>;
  reasoning: string;
};

let forwarderDriftMemory: Record<string, DriftLog[]> = {};

export function updateForwarderMemory({
  forwarderId,
  predictedScore,
  actualDeliveryDays,
  actualCost,
  shipmentId
}: {
  forwarderId: string;
  predictedScore: ForwarderScore;
  actualDeliveryDays: number;
  actualCost: number;
  shipmentId: string;
}): DriftLog {
  const expectedDays = predictedScore.metrics.deliveryTime;
  const expectedCost = predictedScore.metrics.cost;
  const driftTime = actualDeliveryDays - expectedDays;
  const driftCost = actualCost - expectedCost;

  const driftMagnitude = Math.sqrt(driftTime ** 2 + (driftCost / 100) ** 2);

  // Adjust weights if drift is above tolerance
  const baseWeights = getBaseWeights();
  const weightAdjustment = {
    time: baseWeights.time + (driftTime > 1 ? 0.05 : 0),
    cost: baseWeights.cost + (driftCost > 200 ? 0.05 : 0),
    reliability: baseWeights.reliability - 0.05
  };

  const reasoning = `Detected drift: delivery ${driftTime > 0 ? 'late' : 'on-time'}, cost ${driftCost > 0 ? 'higher' : 'lower'} than expected`;

  const driftLog: DriftLog = {
    shipmentId,
    forwarder: forwarderId,
    predicted: predictedScore,
    actual: { deliveryDays: actualDeliveryDays, cost: actualCost },
    driftMagnitude,
    weightAdjustment,
    reasoning
  };

  // Persist to Supabase
  persistDriftLog(driftLog);

  forwarderDriftMemory[forwarderId] = [
    ...(forwarderDriftMemory[forwarderId] || []),
    driftLog
  ];

  return driftLog;
}

export function getForwarderDriftLogs(forwarderId: string): DriftLog[] {
  return forwarderDriftMemory[forwarderId] || [];
}
