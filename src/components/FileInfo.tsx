'use client'

import { useState } from 'react'
import { FileData } from '@/app/page'

interface FileInfoProps {
  file: FileData
}

export default function FileInfo({ file }: FileInfoProps) {
  const [showBase64, setShowBase64] = useState(false)
  const [copied, setCopied] = useState(false)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.startsWith('video/')) return '🎥'
    if (mimeType.startsWith('audio/')) return '🎵'
    if (mimeType.startsWith('text/')) return '📝'
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📄'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊'
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️'
    return '📁'
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadFile = () => {
    try {
      const link = document.createElement('a')
      link.href = file.base64
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const isImage = file.type.startsWith('image/')
  const base64WithoutPrefix = file.base64.split(',')[1] || file.base64

  return (
    <div className="space-y-4">
      {/* File Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getFileIcon(file.type)}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {file.type || 'Unknown type'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Size:</span>
              <span className="font-medium">{formatFileSize(file.size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Base64 Length:</span>
              <span className="font-medium">{base64WithoutPrefix.length.toLocaleString()} chars</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Modified:</span>
              <span className="font-medium">
                {new Date(file.lastModified).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          {isImage ? (
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <img
                src={file.base64}
                alt={file.name}
                className="w-full h-32 object-cover"
              />
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
              <div className="text-center">
                <div className="text-3xl mb-2">{getFileIcon(file.type)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No preview available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={downloadFile}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          💾 Download File
        </button>
        
        <button
          onClick={() => copyToClipboard(file.base64)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {copied ? '✅ Copied!' : '📋 Copy Base64'}
        </button>
        
        <button
          onClick={() => setShowBase64(!showBase64)}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showBase64 ? '👁️ Hide Base64' : '👁️ Show Base64'}
        </button>
      </div>

      {/* Base64 Display */}
      {showBase64 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Base64 String
            </label>
            <button
              onClick={() => copyToClipboard(base64WithoutPrefix)}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              📋 Copy Raw
            </button>
          </div>
          
          <textarea
            value={file.base64}
            readOnly
            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono resize-none"
          />
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 This includes the data URL prefix. Use "Copy Raw" for base64 only.
          </p>
        </div>
      )}
    </div>
  )
}
