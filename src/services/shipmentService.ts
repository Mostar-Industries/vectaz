import { supabase } from '@/integrations/supabase/client';
import { storePendingOperation } from '@/utils/offlineCache';
import type { Shipment } from '@/types/deeptrack';

export const addShipment = async (shipment: Omit<Shipment, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .insert([{
        ...shipment,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      await storePendingOperation('addShipment', shipment);
      throw error;
    }

    return data[0] as Shipment;
  } catch (error) {
    console.error('Failed to add shipment:', error);
    throw error;
  }
};

export const getShipments = async () => {
  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Shipment[];
};
