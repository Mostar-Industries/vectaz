
/**
 * Utility for generating SHA-256 hashes of files and data
 * In a real application, this would use a proper crypto library
 */

/**
 * Generate a simple hash from a string
 * @param str String to hash
 * @returns Simple hash of the string
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'sha256-' + Math.abs(hash).toString(16);
}

/**
 * Create a version identifier with timestamp
 * @returns Version string with timestamp
 */
export function generateVersionId(): string {
  return `v1.0.0-deepbase-${new Date().toISOString().replace(/[:.]/g, '-')}`;
}

/**
 * Convert a File object to a data URL
 * @param file File object to convert
 * @returns Promise resolving to the data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Hash a data buffer (for file uploads)
 * @param data ArrayBuffer containing file data
 * @returns Hash of the data
 */
export function hashDataBuffer(data: ArrayBuffer): string {
  // In a real app, we'd use crypto.subtle.digest to create a proper SHA-256 hash
  // For this demo, we'll convert to string and use our simple hash
  const view = new Uint8Array(data);
  let str = '';
  for (let i = 0; i < view.length; i++) {
    str += String.fromCharCode(view[i]);
  }
  return simpleHash(str);
}
