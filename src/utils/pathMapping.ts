
import { toast } from '@/hooks/use-toast';
import yaml from 'js-yaml';

// Convert references from CORE/... to src/core/...
export function getNewPath(path: string): string {
  if (path.startsWith('CORE/')) {
    return `src/core/${path.substring(5)}`;
  }
  return path;
}

// Check if a path points to a YAML file
function isYamlFile(path: string): boolean {
  return path.endsWith('.yaml') || path.endsWith('.yml');
}

// Fetch data from a path, handling both JSON and YAML formats
export async function fetchJsonData(path: string): Promise<any> {
  try {
    const newPath = getNewPath(path);
    
    // For development environment, we'll make a fetch request
    const response = await fetch(`/${newPath}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${newPath}: ${response.statusText}`);
    }
    
    const isYaml = isYamlFile(path);
    
    if (isYaml) {
      // Parse as YAML
      const text = await response.text();
      return yaml.load(text) || {};
    } else {
      // Parse as JSON
      return await response.json();
    }
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
