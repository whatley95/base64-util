export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const getMimeTypeFromExtension = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Text
    txt: 'text/plain',
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    xml: 'text/xml',
    csv: 'text/csv',
    
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    flac: 'audio/flac',
    
    // Video
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    webm: 'video/webm',
    mkv: 'video/x-matroska',
  }
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
}

export const isValidBase64 = (str: string): boolean => {
  try {
    // Remove data URL prefix if present
    const base64String = str.includes(',') ? str.split(',')[1] : str
    
    // Check if string contains only valid base64 characters
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64String)) {
      return false
    }
    
    // Try to decode
    atob(base64String)
    return true
  } catch (error) {
    return false
  }
}

export const generateFileName = (mimeType: string, operation: 'encode' | 'decode'): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const extension = getExtensionFromMimeType(mimeType)
  return `${operation}d-${timestamp}${extension}`
}

export const getExtensionFromMimeType = (mimeType: string): string => {
  const mimeToExtension: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/bmp': '.bmp',
    'image/x-icon': '.ico',
    
    'text/plain': '.txt',
    'text/html': '.html',
    'text/css': '.css',
    'text/javascript': '.js',
    'application/json': '.json',
    'text/xml': '.xml',
    'text/csv': '.csv',
    
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    
    'application/zip': '.zip',
    'application/x-rar-compressed': '.rar',
    'application/x-7z-compressed': '.7z',
    'application/x-tar': '.tar',
    'application/gzip': '.gz',
    
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/ogg': '.ogg',
    'audio/mp4': '.m4a',
    'audio/flac': '.flac',
    
    'video/mp4': '.mp4',
    'video/x-msvideo': '.avi',
    'video/quicktime': '.mov',
    'video/x-ms-wmv': '.wmv',
    'video/x-flv': '.flv',
    'video/webm': '.webm',
    'video/x-matroska': '.mkv',
  }
  
  return mimeToExtension[mimeType] || '.bin'
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      return result
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Detects file type based on file signatures (magic bytes)
 * 
 * @param bytes - The array of bytes from the file
 * @returns MIME type string
 */
export const detectFileTypeFromBytes = (bytes: Uint8Array): string => {
  // Function to check if bytes match a signature pattern
  const matchSignature = (signature: number[], offset: number = 0): boolean => {
    if (bytes.length < offset + signature.length) return false
    return signature.every((byte, i) => byte === -1 || byte === bytes[offset + i])
  }
  
  // Common file signatures (magic bytes)
  // PDF
  if (matchSignature([0x25, 0x50, 0x44, 0x46])) { // %PDF
    return 'application/pdf'
  }
  
  // Images
  if (matchSignature([0xFF, 0xD8, 0xFF])) {
    return 'image/jpeg' // JPEG
  }
  if (matchSignature([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
    return 'image/png' // PNG
  }
  if (matchSignature([0x47, 0x49, 0x46, 0x38])) {
    return 'image/gif' // GIF
  }
  if (matchSignature([0x52, 0x49, 0x46, 0x46]) && matchSignature([0x57, 0x45, 0x42, 0x50], 8)) {
    return 'image/webp' // WebP
  }
  if (matchSignature([0x42, 0x4D])) {
    return 'image/bmp' // BMP
  }
  
  // Archives
  if (matchSignature([0x50, 0x4B, 0x03, 0x04])) {
    return 'application/zip' // ZIP (also used by DOCX, XLSX, PPTX)
  }
  if (matchSignature([0x52, 0x61, 0x72, 0x21])) {
    return 'application/x-rar-compressed' // RAR
  }
  if (matchSignature([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) {
    return 'application/x-7z-compressed' // 7-Zip
  }
  
  // Office documents
  // Check for Office Open XML formats (DOCX, XLSX, PPTX) - they're ZIP files with specific internal structure
  if (matchSignature([0x50, 0x4B, 0x03, 0x04])) {
    // Try to determine if it's Excel by checking for specific Excel content in the bytes
    const textDecoder = new TextDecoder('utf-8', { fatal: false })
    const textContent = textDecoder.decode(bytes.slice(0, Math.min(1000, bytes.length)))
    
    // Look for Excel specific markers in ZIP content
    if (textContent.includes('xl/') || textContent.includes('xl\\') || 
        textContent.includes('workbook.xml') || textContent.includes('sharedStrings')) {
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // XLSX
    }
    // Check for Word document
    else if (textContent.includes('word/') || textContent.includes('word\\') ||
             textContent.includes('document.xml')) {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
    }
    // Check for PowerPoint
    else if (textContent.includes('ppt/') || textContent.includes('ppt\\') ||
             textContent.includes('presentation.xml')) {
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation' // PPTX
    }
    
    return 'application/zip'
  }
  
  // Check for older Office formats (OLE Compound Document)
  if (matchSignature([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])) {
    // This is the signature for Microsoft Compound File Binary Format
    // Try to determine the type by looking for patterns in the binary data
    
    // Convert part of the file to a string for pattern matching
    const textContent = Array.from(bytes.slice(0, Math.min(2000, bytes.length)))
      .map(byte => String.fromCharCode(byte))
      .join('')
    
    // Look for Excel specific markers
    if (textContent.includes('Excel.Sheet') || textContent.includes('Worksheet') ||
        textContent.includes('Workbook')) {
      return 'application/vnd.ms-excel' // XLS
    }
    // Look for Word specific markers
    else if (textContent.includes('Word.Document') || textContent.includes('MSWordDoc')) {
      return 'application/msword' // DOC
    }
    // Look for PowerPoint specific markers
    else if (textContent.includes('PowerPoint') || textContent.includes('Presentation')) {
      return 'application/vnd.ms-powerpoint' // PPT
    }
    
    return 'application/msword' // Default to .doc if specific type can't be determined
  }
  
  // Text formats
  // CSV, XML, JSON, HTML, etc. are harder to detect by magic bytes alone
  // Need to check content structure
  
  // For CSV detection, check if first chunk has comma-separated values
  const isCSV = (): boolean => {
    try {
      if (bytes.length < 10) return false
      
      // Convert first ~500 bytes to a string for better detection
      const textDecoder = new TextDecoder('utf-8', { fatal: false })
      const textChunk = textDecoder.decode(bytes.slice(0, Math.min(500, bytes.length)))
      
      // Check for CSV pattern: has commas, consistent structure
      const lines = textChunk.split(/\r?\n/).filter(line => line.trim().length > 0)
      if (lines.length < 1) return false
      
      // Look for commas in first few lines
      const hasCommas = lines.slice(0, Math.min(5, lines.length))
                              .filter(line => line.includes(','))
                              .length >= Math.min(2, lines.length)
                              
      if (!hasCommas) return false
      
      const firstLineFields = lines[0].split(',').length
      
      // Check if subsequent lines have similar number of fields
      const consistentStructure = lines.length === 1 || 
        lines.slice(1, Math.min(5, lines.length))
             .filter(line => Math.abs(line.split(',').length - firstLineFields) <= 1)
             .length >= Math.min(2, lines.length - 1)
      
      // Additional check for Excel CSV export patterns
      const hasExcelHeaders = lines[0].split(',')
                                     .some(field => 
                                        /^"?\w+"?$/i.test(field.trim()) || // Column headers like "Name" or ID
                                        /^"?[\w\s]+"?$/i.test(field.trim()) // Column headers with spaces
                                      )
                                      
      return hasCommas && (consistentStructure || hasExcelHeaders) && firstLineFields > 1
    } catch {
      return false
    }
  }
  
  if (isCSV()) {
    return 'text/csv'
  }
  
  // Check for XML
  const isXML = (): boolean => {
    try {
      const textDecoder = new TextDecoder('utf-8')
      const textChunk = textDecoder.decode(bytes.slice(0, Math.min(100, bytes.length)))
      return textChunk.trim().startsWith('<?xml') || textChunk.trim().match(/<[a-zA-Z][^>]*>/) !== null
    } catch {
      return false
    }
  }
  
  if (isXML()) {
    return 'text/xml'
  }
  
  // Check for JSON
  const isJSON = (): boolean => {
    try {
      const textDecoder = new TextDecoder('utf-8')
      const textChunk = textDecoder.decode(bytes.slice(0, Math.min(100, bytes.length)))
      const trimmed = textChunk.trim()
      return (trimmed.startsWith('{') && trimmed.includes(':')) || 
             (trimmed.startsWith('[') && trimmed.includes(','))
    } catch {
      return false
    }
  }
  
  if (isJSON()) {
    return 'application/json'
  }
  
  // Check if it's likely HTML
  const isHTML = (): boolean => {
    try {
      const textDecoder = new TextDecoder('utf-8')
      const textChunk = textDecoder.decode(bytes.slice(0, Math.min(500, bytes.length))).toLowerCase()
      return textChunk.includes('<html') || 
             textChunk.includes('<!doctype html') ||
             (textChunk.includes('<head') && textChunk.includes('<body'))
    } catch {
      return false
    }
  }
  
  if (isHTML()) {
    return 'text/html'
  }
  
  // Default - generic binary or text
  try {
    // Try to decode as UTF-8 to see if it's text-based
    const textDecoder = new TextDecoder('utf-8', { fatal: true })
    textDecoder.decode(bytes.slice(0, Math.min(500, bytes.length)))
    return 'text/plain' // If no errors, it's likely text
  } catch {
    return 'application/octet-stream' // Binary file
  }
}
