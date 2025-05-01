import { z } from 'zod';
import { Shipment } from '@/types/deeptrack';

const ShipmentSchema = z.object({
  id: z.string(),
  items: z.array(z.string()),
  destination: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: z.enum(['pending', 'shipped', 'delayed'])
});

export function validateAndMergeData(
  localData: Shipment[], 
  remoteData: any[]
): { valid: boolean; mergedData: Shipment[]; conflicts: string[] } {
  const validatedRemote = remoteData
    .map(item => {
      const result = ShipmentSchema.safeParse(item);
      return result.success ? result.data : null;
    })
    .filter(Boolean) as Shipment[];

  const conflicts: string[] = [];
  const merged = [...localData];

  validatedRemote.forEach(remoteItem => {
    const localIndex = merged.findIndex(s => s.id === remoteItem.id);
    
    if (localIndex >= 0) {
      // Conflict resolution - prefer newer data
      if (new Date(remoteItem.updated_at) > new Date(merged[localIndex].updated_at)) {
        conflicts.push(`Updated shipment ${remoteItem.id}`);
        merged[localIndex] = remoteItem;
      }
    } else {
      merged.push(remoteItem);
    }
  });

  return {
    valid: validatedRemote.length === remoteData.length, // All remote data valid
    mergedData: merged,
    conflicts
  };
}
