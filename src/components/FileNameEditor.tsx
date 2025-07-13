'use client'

import { useState } from 'react'
import { FileData } from '@/app/page'

interface FileNameEditorProps {
  file: FileData;
  onSave: (newFilename: string) => void;
  onCancel: () => void;
}

export default function FileNameEditor({ file, onSave, onCancel }: FileNameEditorProps) {
  const [filename, setFilename] = useState(file.name)
  const extension = file.name.includes('.') ? `.${file.name.split('.').pop()}` : ''
  
  const baseName = extension ? filename.slice(0, filename.lastIndexOf(extension)) : filename
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Don't allow empty filenames
    if (!filename.trim()) {
      return
    }
    
    // Ensure extension is preserved
    const newFilename = extension && !filename.endsWith(extension) 
      ? `${filename}${extension}` 
      : filename
      
    onSave(newFilename)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md mx-auto">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Filename</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="filename" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filename
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="filename"
                value={baseName}
                onChange={(e) => setFilename(extension ? `${e.target.value}${extension}` : e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                autoFocus
                placeholder="Enter filename"
              />
              {extension && (
                <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-r-md">
                  {extension}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
