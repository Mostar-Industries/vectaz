import type { ForwarderPerformance } from '@/types/deeptrack';

export function assertForwarderShape(obj: any): asserts obj is ForwarderPerformance {
  if (
    typeof obj?.freight_carrier !== 'string' ||
    typeof obj?.avg_transit_days !== 'number' ||
    typeof obj?.reliability_score !== 'number' ||
    typeof obj?.deep_score !== 'number'
  ) {
    throw new Error(`Invalid ForwarderPerformance object: ${JSON.stringify(obj)}`);
  }
}
