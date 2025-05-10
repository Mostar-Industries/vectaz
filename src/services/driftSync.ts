import supabase from '@/lib/supabaseClient';
import type { DriftLog } from '@/types/deeptrack';

const DRIFT_QUEUE_KEY = 'drift_log_queue';

function queueLocally(log: DriftLog): void {
  const queue = JSON.parse(localStorage.getItem(DRIFT_QUEUE_KEY) || '[]');
  queue.push(log);
  localStorage.setItem(DRIFT_QUEUE_KEY, JSON.stringify(queue));
}

export async function persistDriftLog(log: DriftLog): Promise<void> {
  try {
    const { error } = await supabase.from('drift_logs').insert([{
      forwarder_id: log.forwarder,
      shipment_id: log.shipmentId,
      drift_type: getDriftType(log),
      magnitude: log.driftMagnitude,
      original_score: log.predicted.score,
      adjusted_score: log.predicted.score * (1 - log.driftMagnitude),
      adjustment_reason: log.reasoning,
      logged_at: new Date().toISOString()
    }]);
    
    if (error) throw error;
  } catch (err) {
    console.warn(" Drift log deferred (offline?):", err.message);
    queueLocally(log);
  }
}

function getDriftType(log: DriftLog): string {
  const timeDrift = log.actual.deliveryDays - log.predicted.metrics?.deliveryTime;
  const costDrift = log.actual.cost - log.predicted.metrics?.cost;
  
  if (Math.abs(timeDrift) > 1 && Math.abs(costDrift) > 100) return 'combined';
  if (Math.abs(timeDrift) > 1) return 'delivery_delay';
  return 'cost_variance';
}

// Sync queued logs on connection restored
export async function syncQueuedLogs(): Promise<void> {
  const queue = JSON.parse(localStorage.getItem(DRIFT_QUEUE_KEY) || '[]');
  if (queue.length === 0) return;

  try {
    await Promise.all(queue.map(persistDriftLog));
    localStorage.removeItem(DRIFT_QUEUE_KEY);
  } catch (err) {
    console.error('Failed to sync queued logs:', err);
  }
}
