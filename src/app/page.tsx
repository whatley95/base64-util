'use client'

import { useState } from 'react'
import FileUploadZone from '@/components/FileUploadZone'
import Base64Input from '@/components/Base64Input'
import FileInfo from '@/components/FileInfo'
import ConversionHistory from '@/components/ConversionHistory'
import { getExtensionFromMimeType } from '@/lib/utils'

export interface FileData {
  name: string
  type: string
  size: number
  base64: string
  lastModified: number
}

export interface HistoryItem {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  timestamp: Date
  operation: 'encode' | 'decode'
}

// Shared state for file type selector
export interface FileTypeState {
  showFileTypeSelector: boolean
  detectedFileType: string | null
  decodedBytes: Uint8Array | null
  decodedBase64Data: string | null
}

export default function Home() {
  const [currentFile, setCurrentFile] = useState<FileData | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [fileTypeState, setFileTypeState] = useState<FileTypeState>({
    showFileTypeSelector: false,
    detectedFileType: null,
    decodedBytes: null,
    decodedBase64Data: null
  })

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    setHistory(prev => [newItem, ...prev.slice(0, 9)]) // Keep last 10 items
  }

  const handleFileEncoded = (fileData: FileData) => {
    setCurrentFile(fileData)
    addToHistory({
      fileName: fileData.name,
      fileType: fileData.type,
      fileSize: fileData.size,
      operation: 'encode',
    })
  }

  const handleFileDecoded = (fileData: FileData) => {
    setCurrentFile(fileData)
    addToHistory({
      fileName: fileData.name,
      fileType: fileData.type,
      fileSize: fileData.size,
      operation: 'decode',
    })
  }

  const clearCurrentFile = () => {
    setCurrentFile(null)
    setFileTypeState({
      showFileTypeSelector: false,
      detectedFileType: null,
      decodedBytes: null,
      decodedBase64Data: null
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Base64 Util
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Convert files to base64 encoding and decode base64 back to files. 
          Fast, secure, and works entirely in your browser.
        </p>
      </div>

      {/* Conversion Tools - Side by side at the top */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-8">
        {/* File to Base64 - Left */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            📁 File to Base64
          </h2>
          <FileUploadZone onFileEncoded={handleFileEncoded} />
        </div>

        {/* Base64 to File - Right */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            🔢 Base64 to File
          </h2>
          <Base64Input 
            onFileDecoded={handleFileDecoded}
            fileTypeState={fileTypeState}
            setFileTypeState={setFileTypeState}
          />
        </div>
      </div>

      {/* Results and History Section */}
      <div className="max-w-7xl mx-auto">
        {/* File Type Selector (above File Info) */}
        {fileTypeState.showFileTypeSelector && currentFile && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span className="text-blue-800 dark:text-blue-300 font-medium">File Decoded Successfully</span>
                {fileTypeState.detectedFileType && 
                 fileTypeState.detectedFileType !== 'application/octet-stream' && 
                 fileTypeState.detectedFileType !== 'text/plain' && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                    {fileTypeState.detectedFileType.split('/')[1] || fileTypeState.detectedFileType}
                  </span>
                )}
              </div>
              <button
                onClick={() => setFileTypeState(prev => ({...prev, showFileTypeSelector: false}))}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* File type selection grid */}
            <div className="mt-2">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Change file type:</p>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 max-h-[100px] overflow-y-auto">
                {[
                  { name: 'CSV', mimeType: 'text/csv' },
                  { name: 'Excel (.xlsx)', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
                  { name: 'Excel (.xls)', mimeType: 'application/vnd.ms-excel' },
                  { name: 'PDF', mimeType: 'application/pdf' },
                  { name: 'Word (.docx)', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
                  { name: 'Word (.doc)', mimeType: 'application/msword' },
                  { name: 'Text', mimeType: 'text/plain' },
                  { name: 'JSON', mimeType: 'application/json' },
                  { name: 'XML', mimeType: 'text/xml' },
                  { name: 'HTML', mimeType: 'text/html' },
                  { name: 'ZIP', mimeType: 'application/zip' },
                  { name: 'JPEG', mimeType: 'image/jpeg' },
                  { name: 'PNG', mimeType: 'image/png' },
                  { name: 'Binary', mimeType: 'application/octet-stream' }
                ].map((fileType) => (
                  <button
                    key={fileType.mimeType}
                    onClick={() => {
                      if (fileTypeState.decodedBytes && fileTypeState.decodedBase64Data) {
                        // Re-process with the new file type
                        const extension = getExtensionFromMimeType(fileType.mimeType)
                        const fileName = `decoded-file${extension}`
                        
                        setCurrentFile({
                          name: fileName,
                          type: fileType.mimeType,
                          size: fileTypeState.decodedBytes.length,
                          base64: `data:${fileType.mimeType};base64,${fileTypeState.decodedBase64Data}`,
                          lastModified: Date.now(),
                        })
                      }
                    }}
                    className={`text-left px-1.5 py-0.5 ${
                      fileType.mimeType === fileTypeState.detectedFileType 
                        ? 'bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-500' 
                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    } border rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors`}
                  >
                    <div className="flex items-center gap-1">
                      {fileType.mimeType === fileTypeState.detectedFileType && <span className="text-blue-600 dark:text-blue-300 text-xs">✓</span>}
                      <div className="font-medium text-gray-800 dark:text-white text-xs truncate">{fileType.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Current File Info */}
        {currentFile && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                📋 File Information
              </h2>
              <button
                onClick={clearCurrentFile}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <FileInfo file={currentFile} />
          </div>
        )}

        {/* Conversion History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            📜 Recent Conversions
          </h2>
          <ConversionHistory history={history} />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">
          Built with Next.js & Tailwind CSS • Deployed on Cloudflare Pages
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          All conversions happen locally in your browser - your files never leave your device.
        </p>
        <div className="mt-4">
          <a 
            href="https://whatley.xyz/playground" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors font-medium"
          >
            Visit whatley.xyz/playground
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} - All rights reserved
        </p>
      </footer>
    </div>
  )
}