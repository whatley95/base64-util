// Web worker for processing large base64 data
// This prevents the main UI thread from being blocked during heavy operations

/**
 * Process base64 data in a worker thread
 */
self.onmessage = function(e) {
  const { action, base64Data, mimeType } = e.data;
  
  try {
    if (action === 'decode') {
      // Decode base64 to binary
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      
      // Process in chunks to avoid blocking
      const chunkSize = 100000; // Process 100KB at a time
      const totalChunks = Math.ceil(binaryString.length / chunkSize);
      
      // Report progress as we go
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, binaryString.length);
        
        for (let j = start; j < end; j++) {
          bytes[j] = binaryString.charCodeAt(j);
        }
        
        // Report progress
        if (totalChunks > 1) {
          self.postMessage({
            type: 'progress',
            progress: (i + 1) / totalChunks
          });
        }
      }
      
      // Try to detect file type if not provided
      let detectedType = mimeType || 'application/octet-stream';
      if (!mimeType) {
        detectedType = detectFileTypeFromBytes(bytes) || 'application/octet-stream';
      }
      
      // Return the processed data
      self.postMessage({
        type: 'complete',
        bytes: bytes,
        detectedType: detectedType
      });
    } 
    else if (action === 'encode') {
      // The data is already a Uint8Array sent from the main thread
      const bytes = base64Data;
      const binary = [];
      const len = bytes.byteLength;
      
      // Process in chunks
      const chunkSize = 100000; // Process 100KB at a time
      const totalChunks = Math.ceil(len / chunkSize);
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, len);
        
        for (let j = start; j < end; j++) {
          binary.push(String.fromCharCode(bytes[j]));
        }
        
        // Report progress
        if (totalChunks > 1) {
          self.postMessage({
            type: 'progress',
            progress: (i + 1) / totalChunks
          });
        }
      }
      
      // Convert binary to base64
      const base64 = btoa(binary.join(''));
      
      self.postMessage({
        type: 'complete',
        base64: base64
      });
    }
    else {
      throw new Error('Unknown action');
    }
  }
  catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message || 'Unknown error in worker'
    });
  }
};

// Simple file signature detection based on magic bytes
// This is a simplified version of the one in the main app
function detectFileTypeFromBytes(bytes) {
  // Function to check if bytes match a signature pattern
  const matchSignature = (signature, offset = 0) => {
    if (bytes.length < offset + signature.length) return false;
    return signature.every((byte, i) => byte === -1 || byte === bytes[offset + i]);
  };
  
  // Check for common file types
  if (matchSignature([0x25, 0x50, 0x44, 0x46])) return 'application/pdf';
  if (matchSignature([0xFF, 0xD8, 0xFF])) return 'image/jpeg';
  if (matchSignature([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) return 'image/png';
  if (matchSignature([0x47, 0x49, 0x46, 0x38])) return 'image/gif';
  if (matchSignature([0x50, 0x4B, 0x03, 0x04])) return 'application/zip';
  
  // Default to binary if unknown
  return 'application/octet-stream';
}
