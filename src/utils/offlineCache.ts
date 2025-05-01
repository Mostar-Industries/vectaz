const PENDING_OPS_KEY = 'pending_shipment_ops';

export const storePendingOperation = async (type: string, payload: any) => {
  const pending = JSON.parse(localStorage.getItem(PENDING_OPS_KEY) || '[]');
  pending.push({
    type,
    payload,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(PENDING_OPS_KEY, JSON.stringify(pending));
};

export const retryPendingOperations = async () => {
  const pending = JSON.parse(localStorage.getItem(PENDING_OPS_KEY) || '[]');
  const successfulOps = [];

  for (const op of pending) {
    try {
      // Replay operation
      await supabase
        .from('shipments')
        .insert([op.payload])
        .select();
      
      successfulOps.push(op);
    } catch (error) {
      console.warn(`Failed to retry ${op.type} operation:`, error);
    }
  }

  // Remove successful operations
  localStorage.setItem(
    PENDING_OPS_KEY, 
    JSON.stringify(pending.filter((op: any) => !successfulOps.includes(op)))
  );
};

// Add to boot sequence
import { bootApp } from '@/init/boot';
import { supabase } from '@/integrations/supabase/client';

bootApp().then(() => {
  retryPendingOperations();
});
