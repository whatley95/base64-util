'use client'

import { useState, useCallback, Dispatch, SetStateAction } from 'react'
import { FileData, FileTypeState } from '@/app/page'
import { detectFileTypeFromBytes, getExtensionFromMimeType } from '@/lib/utils'

interface Base64InputProps {
  onFileDecoded: (fileData: FileData) => void;
  fileTypeState: FileTypeState;
  setFileTypeState: Dispatch<SetStateAction<FileTypeState>>;
}

export default function Base64Input({ 
  onFileDecoded, 
  fileTypeState, 
  setFileTypeState 
}: Base64InputProps) {
  const [base64Input, setBase64Input] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Common file types for users to select
  const commonFileTypes = [
    { name: 'CSV Spreadsheet', mimeType: 'text/csv' },
    { name: 'Excel Spreadsheet (.xlsx)', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    { name: 'Excel Spreadsheet (.xls)', mimeType: 'application/vnd.ms-excel' },
    { name: 'PDF Document', mimeType: 'application/pdf' },
    { name: 'Word Document (.docx)', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { name: 'Word Document (.doc)', mimeType: 'application/msword' },
    { name: 'Text File', mimeType: 'text/plain' },
    { name: 'JSON Data', mimeType: 'application/json' },
    { name: 'XML Data', mimeType: 'text/xml' },
    { name: 'HTML Page', mimeType: 'text/html' },
    { name: 'ZIP Archive', mimeType: 'application/zip' },
    { name: 'JPEG Image', mimeType: 'image/jpeg' },
    { name: 'PNG Image', mimeType: 'image/png' },
    { name: 'Binary File', mimeType: 'application/octet-stream' },
  ]

  const processDecodedBytes = useCallback((bytes: Uint8Array, base64Data: string, mimeType: string) => {
    // Generate appropriate extension and filename
    const extension = getExtensionFromMimeType(mimeType)
    const fileName = `decoded-file${extension}`
    
    const fileData: FileData = {
      name: fileName,
      type: mimeType,
      size: bytes.length,
      base64: base64Input.startsWith('data:') ? base64Input : `data:${mimeType};base64,${base64Data}`,
      lastModified: Date.now(),
    }
    
    onFileDecoded(fileData)
  }, [base64Input, onFileDecoded])
  
  const decodeBase64 = useCallback(async () => {
    if (!base64Input.trim()) {
      setError('Please enter a base64 string')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      let base64Data = base64Input.trim()
      let mimeType = 'application/octet-stream'

      // Check if it's a data URL
      if (base64Data.startsWith('data:')) {
        const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/)
        if (matches) {
          mimeType = matches[1]
          base64Data = matches[2]
        } else {
          throw new Error('Invalid data URL format')
        }
      }

      // Validate base64
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
        throw new Error('Invalid base64 characters detected')
      }

      // Try to decode to check if it's valid
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      // For raw base64 strings, try to detect file type
      if (!base64Input.startsWith('data:')) {
        // Detect file type from bytes
        mimeType = detectFileTypeFromBytes(bytes)
      }
      
      // Update the shared file type state
      setFileTypeState({
        showFileTypeSelector: true,
        detectedFileType: mimeType,
        decodedBytes: bytes,
        decodedBase64Data: base64Data
      })
      
      // Auto-decode with the detected file type
      processDecodedBytes(bytes, base64Data, mimeType)
    } catch (error) {
      console.error('Error decoding base64:', error)
      setError(error instanceof Error ? error.message : 'Invalid base64 string')
    } finally {
      setIsProcessing(false)
    }
  }, [base64Input, processDecodedBytes, setFileTypeState])

  const handlePaste = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.readText().then(text => {
        setBase64Input(text)
      }).catch(err => {
        console.error('Failed to read clipboard:', err)
      })
    }
  }, [])

  const clearInput = () => {
    setBase64Input('')
    setError(null)
    
    setFileTypeState(prev => ({
      ...prev,
      showFileTypeSelector: false
    }))
  }

  return (
    <div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Base64 String
          </label>
          <div className="flex gap-2">
            <button
              onClick={handlePaste}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              📋 Paste
            </button>
            {base64Input && (
              <button
                onClick={clearInput}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>
        
        <textarea
          value={base64Input}
          onChange={(e) => setBase64Input(e.target.value)}
          placeholder="Paste your base64 string here... (with or without data URL prefix)"
          className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
          disabled={isProcessing || fileTypeState.showFileTypeSelector}
        />
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400">❌ {error}</p>
          </div>
        )}
      </div>
      
      {/* Decode button - only show when file type selector is not visible */}
      {!fileTypeState.showFileTypeSelector && (
        <button
          onClick={decodeBase64}
          disabled={!base64Input.trim() || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              🔄 Decode to File
            </>
          )}
        </button>
      )}

      <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-2 mt-2">
        <p className="text-xs text-yellow-600 dark:text-yellow-400">
          💡 Accepts raw base64 strings and data URLs. Auto-detects file types and decodes immediately.
        </p>
      </div>
    </div>
  )
}
