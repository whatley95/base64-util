'use client'

import { HistoryItem } from '@/app/page'

interface ConversionHistoryProps {
  history: HistoryItem[]
}

export default function ConversionHistory({ history }: ConversionHistoryProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
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

  const getOperationIcon = (operation: 'encode' | 'decode'): string => {
    return operation === 'encode' ? '📤' : '📥'
  }

  const getOperationColor = (operation: 'encode' | 'decode'): string => {
    return operation === 'encode' 
      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
      : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
  }

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInSecs = Math.floor(diffInMs / 1000)
    const diffInMins = Math.floor(diffInSecs / 60)
    const diffInHours = Math.floor(diffInMins / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInSecs < 60) {
      return 'Just now'
    } else if (diffInMins < 60) {
      return `${diffInMins}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return `${diffInDays}d ago`
    }
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">📭</div>
        <p className="text-gray-500 dark:text-gray-400">
          No conversions yet
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Upload a file or paste base64 to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {/* Operation Badge */}
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getOperationColor(item.operation)}`}>
            <span className="text-sm">
              {getOperationIcon(item.operation)}
            </span>
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getFileIcon(item.fileType)}</span>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {item.fileName}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="capitalize">{item.operation}d</span>
              <span>{formatFileSize(item.fileSize)}</span>
              <span>{formatTimeAgo(item.timestamp)}</span>
            </div>
          </div>

          {/* File Type Badge */}
          <div className="hidden sm:block">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
              {item.fileType.split('/')[1] || 'unknown'}
            </span>
          </div>
        </div>
      ))}

      {history.length >= 10 && (
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Showing last 10 conversions
          </p>
        </div>
      )}
    </div>
  )
}
