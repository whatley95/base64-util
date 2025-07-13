'use client'

/**
 * Calculate the SHA-256 hash of a Uint8Array
 * @param data The binary data to hash
 * @returns The SHA-256 hash as a hex string
 */
export async function calculateSHA256(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculate the SHA-256 hash of a base64 string
 * @param base64 The base64 string to hash
 * @returns The SHA-256 hash as a hex string
 */
export async function calculateSHA256FromBase64(base64: string): Promise<string> {
  // If it's a data URL, extract just the base64 part
  const base64Data = base64.includes('base64,') ? base64.split('base64,')[1] : base64;
  
  // Convert base64 to binary
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return calculateSHA256(bytes);
}

/**
 * Calculate file size as a human-readable string
 * @param bytes The size in bytes
 * @returns Formatted string like "4.2 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get additional metadata for specific file types
 * @param fileData The file data object
 * @returns Object with additional metadata properties
 */
export async function getEnhancedMetadata(fileData: { type: string; base64: string }): Promise<Record<string, any>> {
  const metadata: Record<string, any> = {};
  
  // Extract the base64 data without the prefix
  const base64Data = fileData.base64.includes('base64,') ? fileData.base64.split('base64,')[1] : fileData.base64;
  
  try {
    // Calculate SHA-256 hash for all files
    metadata.sha256 = await calculateSHA256FromBase64(base64Data);
    
    // For images, get dimensions
    if (fileData.type.startsWith('image/')) {
      const dimensions = await getImageDimensions(fileData.base64);
      if (dimensions) {
        metadata.width = dimensions.width;
        metadata.height = dimensions.height;
      }
    }
    
    // For PDFs, try to get page count (simplified approximation)
    if (fileData.type === 'application/pdf') {
      const pageCount = estimatePdfPageCount(base64Data);
      if (pageCount) {
        metadata.pageCount = pageCount;
      }
    }
  } catch (error) {
    console.error("Error extracting metadata:", error);
  }
  
  return metadata;
}

/**
 * Get image dimensions from a base64 image
 * @param base64Image The base64 encoded image
 * @returns Object with width and height, or null if can't be determined
 */
function getImageDimensions(base64Image: string): Promise<{width: number, height: number} | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = base64Image.startsWith('data:') ? base64Image : `data:image;base64,${base64Image}`;
  });
}

/**
 * Estimate the page count of a PDF from base64 data
 * Note: This is a rough estimation based on occurrences of "/Page"
 * @param base64Data The base64 encoded PDF data
 * @returns Estimated page count or null if can't be determined
 */
function estimatePdfPageCount(base64Data: string): number | null {
  try {
    // Convert base64 to text to look for patterns
    const binaryString = atob(base64Data);
    
    // Look for "/Page" occurrences as a rough estimate
    // This is not accurate for all PDFs but works as a quick estimate
    const pageMatches = binaryString.match(/\/Page\s/g);
    if (pageMatches) {
      return pageMatches.length;
    }
    return null;
  } catch (error) {
    return null;
  }
}
