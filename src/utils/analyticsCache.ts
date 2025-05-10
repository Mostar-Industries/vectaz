import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

export async function cachedQuery<T>(queryKey: string, queryFn: () => Promise<T>): Promise<T> {
  // Check cache first
  const cached = cache.get(queryKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Throttle requests
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Execute and cache
  const data = await queryFn();
  cache.set(queryKey, { data, timestamp: Date.now() });
  return data;
}

export async function fetchShipmentsWithCache(params: any) {
  return cachedQuery(`shipments-${JSON.stringify(params)}`, async () => {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .match(params);
    
    if (error) throw error;
    return data;
  });
}
