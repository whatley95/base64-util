'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FileData } from '@/app/page'
import { calculateSHA256FromBase64, formatFileSize, getEnhancedMetadata } from '@/lib/metadata'
import { generateSmartFilename, getExtensionFromMimeType } from '@/lib/utils'
import FileNameEditor from './FileNameEditor'

interface FileInfoProps {
  file: FileData;
  onFileNameChange?: (newName: string) => void;
}

export default function FileInfo({ file, onFileNameChange }: FileInfoProps) {
  const [showBase64, setShowBase64] = useState(false)
  const [copied, setCopied] = useState(false)
  const [fileHash, setFileHash] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<Record<string, any>>({})
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false)
  const [isEditingFilename, setIsEditingFilename] = useState(false)

  // Calculate hash and additional metadata when file changes
  useEffect(() => {
    setIsLoadingMetadata(true);
    
    const loadMetadata = async () => {
      try {
        // Get enhanced metadata (includes hash)
        const enhancedMetadata = await getEnhancedMetadata(file);
        setMetadata(enhancedMetadata);
        
        if (enhancedMetadata.sha256) {
          setFileHash(enhancedMetadata.sha256);
        }
      } catch (error) {
        console.error("Error loading metadata:", error);
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    
    loadMetadata();
  }, [file]);

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
  
  const handleFilenameChange = (newFilename: string) => {
    setIsEditingFilename(false)
    if (onFileNameChange) {
      onFileNameChange(newFilename)
    }
  }
  
  const handleAutoDetectFilename = () => {
    const smartFilename = generateSmartFilename(file.type, file.base64, 'file')
    if (onFileNameChange) {
      onFileNameChange(smartFilename)
    }
  }

  const isImage = file.type.startsWith('image/')
  const base64WithoutPrefix = file.base64.split(',')[1] || file.base64

  return (
    <div className="space-y-4">
      {/* File Details */}
      {isEditingFilename ? (
        <FileNameEditor 
          file={file}
          onSave={handleFilenameChange}
          onCancel={() => setIsEditingFilename(false)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getFileIcon(file.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    {onFileNameChange && (
                      <button 
                        onClick={() => setIsEditingFilename(true)} 
                        className="text-xs text-blue-600 hover:text-blue-800"
                        title="Edit filename"
                      >
                        ✏️
                      </button>
                    )}
                    {onFileNameChange && file.name === 'decoded-file' + getExtensionFromMimeType(file.type) && (
                      <button 
                        onClick={handleAutoDetectFilename} 
                        className="text-xs text-green-600 hover:text-green-800"
                        title="Auto detect filename"
                      >
                        🪄
                      </button>
                    )}
                  </div>
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
                
                {/* Enhanced metadata */}
                {isLoadingMetadata ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Loading metadata...</span>
                    <div className="animate-pulse h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ) : (
                  <>
                    {fileHash && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">SHA-256:</span>
                        <span className="font-mono text-xs truncate max-w-[150px]" title={fileHash}>
                          {fileHash.slice(0, 10)}...{fileHash.slice(-4)}
                        </span>
                      </div>
                    )}
                    
                    {/* Image dimensions */}
                    {metadata.width && metadata.height && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                        <span className="font-medium">{metadata.width}×{metadata.height}</span>
                      </div>
                    )}
                    
                    {/* PDF page count */}
                    {metadata.pageCount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                        <span className="font-medium">{metadata.pageCount}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-3">
              {isImage ? (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="relative w-full h-32">
                    <Image
                      src={file.base64}
                      alt={file.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized // Since we're using data URLs
                    />
                  </div>
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
        </>
      )}

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
            💡 This includes the data URL prefix. Use &ldquo;Copy Raw&rdquo; for base64 only.
          </p>
        </div>
      )}
    </div>
  )
}
