'use client'

import { useCallback, useState } from 'react'
import { FileData } from '@/app/page'
import { useBase64Worker } from '@/lib/useBase64Worker'

interface FileUploadZoneProps {
  onFileEncoded: (fileData: FileData) => void
}

export default function FileUploadZone({ onFileEncoded }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const { encodeToBase64, isProcessing, progress, error, cancelOperation } = useBase64Worker()

  const processFile = useCallback(async (file: File) => {
    try {
      // First, convert the file to an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      
      // Use the web worker to encode to base64
      const base64String = await encodeToBase64(bytes)
      const base64 = `data:${file.type || 'application/octet-stream'};base64,${base64String}`
      
      const fileData: FileData = {
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        base64,
        lastModified: file.lastModified,
      }

      onFileEncoded(fileData)
    } catch (error) {
      console.error('Error processing file:', error)
      // The worker error handling takes care of the UI feedback
    }
  }, [onFileEncoded, encodeToBase64])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile]
  )

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          <div className="text-4xl">
            {isProcessing ? '⏳' : '📎'}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {isProcessing 
                ? progress > 0 && progress < 1 
                  ? `Processing file... ${Math.round(progress * 100)}%` 
                  : 'Processing file...'
                : 'Drop a file here or click to browse'
              }
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Any file type is supported
            </p>
          </div>

          {!isProcessing && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mx-4">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                💡 Files are processed locally in your browser using Web Workers for better performance.
              </p>
            </div>
          )}

          {/* Progress bar for large files */}
          {isProcessing && progress > 0 && progress < 1 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4 mx-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">❌ {error}</p>
        </div>
      )}

      {isProcessing && (
        <button
          onClick={cancelOperation}
          className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Cancel Operation
        </button>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>📁 Supported: Images, documents, videos, audio, archives, and more</p>
        <p>💾 Files of any size are supported (web worker prevents UI freezing)</p>
      </div>
    </div>
  )
}
