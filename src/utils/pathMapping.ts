
import { toast } from '@/hooks/use-toast';

// Convert references from CORE/... to src/core/...
export function getNewPath(path: string): string {
  if (path.startsWith('CORE/')) {
    return `src/core/${path.substring(5)}`;
  }
  return path;
}

// Fetch JSON data from a path
export async function fetchJsonData(path: string): Promise<any> {
  try {
    const newPath = getNewPath(path);
    
    // For development environment, we'll make a fetch request
    const response = await fetch(`/${newPath}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${newPath}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    toast({
      title: 'Data Fetch Error',
      description: `Failed to load ${path.split('/').pop()}`,
      variant: 'destructive',
    });
    
    // Return empty object as fallback
    return {};
  }
}

// Load a file or resource from a path
export async function loadResource(path: string): Promise<any> {
  return fetchJsonData(path);
}
