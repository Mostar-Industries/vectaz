
// Path mapping utility for handling the transition from old paths to new ones

// Define the map of old paths to new paths
const pathMappings: Record<string, string> = {
  // Data files
  'data/deeptrack.json': 'src/core/base_data/deeptrack_3.json',
  'config/forwarders.json': 'src/core/base_reference/forwarder_folklore.json',
  'js/decision_matrix.json': 'src/core/base_data/decision_matrix.json',
  'legacy/forwarder_lobklore.json': 'src/core/base_reference/forwarder_folklore.json',
  
  // Schema paths
  'schemas/': 'src/core/base_schema/',
  
  // Reference data
  'reference/': 'src/core/base_reference/',
  
  // Engine components
  'services/engine/': 'src/core/base_engine/ts/',
  'python/': 'src/core/base_engine/py/'
};

/**
 * Converts an old path to the new path structure
 * @param oldPath The legacy path to convert
 * @returns The new path in the updated structure
 */
export const getNewPath = (oldPath: string): string => {
  // Check for exact matches first
  if (oldPath in pathMappings) {
    return pathMappings[oldPath];
  }
  
  // Then check for partial matches
  for (const [oldPrefix, newPrefix] of Object.entries(pathMappings)) {
    if (oldPath.startsWith(oldPrefix)) {
      return oldPath.replace(oldPrefix, newPrefix);
    }
  }
  
  // If no match found, return the original
  console.warn(`No path mapping found for: ${oldPath}`);
  return oldPath;
};

/**
 * Utility function to dynamically import a file based on the new path structure
 * @param path The path to import (can be old or new format)
 * @returns The imported module
 */
export const dynamicImport = async (path: string) => {
  const newPath = getNewPath(path);
  try {
    return await import(/* @vite-ignore */ newPath);
  } catch (error) {
    console.error(`Failed to import: ${newPath}`, error);
    throw new Error(`Failed to import: ${newPath}`);
  }
};

/**
 * Fetches JSON data from the specified path, handling the path mapping
 * @param path The path to the JSON file (can be old or new format)
 * @returns The parsed JSON data
 */
export const fetchJsonData = async (path: string) => {
  const newPath = getNewPath(path);
  try {
    const response = await fetch(newPath);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch JSON from: ${newPath}`, error);
    throw new Error(`Failed to fetch JSON from: ${newPath}`);
  }
};
