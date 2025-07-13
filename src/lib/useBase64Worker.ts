'use client'

import { useState, useEffect, useRef } from 'react'

type WorkerAction = 'encode' | 'decode'
type WorkerProgress = {
  type: 'progress'
  progress: number
}
type WorkerError = {
  type: 'error'
  error: string
}
type WorkerCompleteEncode = {
  type: 'complete'
  base64: string
}
type WorkerCompleteDecode = {
  type: 'complete'
  bytes: Uint8Array
  detectedType: string
}

type WorkerMessage = WorkerProgress | WorkerError | WorkerCompleteEncode | WorkerCompleteDecode

export function useBase64Worker() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const workerRef = useRef<Worker | null>(null)

  // Initialize worker
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Worker) {
      workerRef.current = new Worker('/base64-worker.js')
    }
    
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  // Reset state for new operation
  const resetState = () => {
    setIsProcessing(true)
    setProgress(0)
    setError(null)
  }

  // Encode binary data to base64
  const encodeToBase64 = (data: Uint8Array): Promise<string> => {
    resetState()
    
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        setIsProcessing(false)
        reject('Web Workers are not supported in your browser')
        return
      }
      
      const handleMessage = (e: MessageEvent<WorkerMessage>) => {
        const data = e.data
        
        if (data.type === 'progress') {
          setProgress(data.progress)
        } 
        else if (data.type === 'error') {
          setIsProcessing(false)
          setError(data.error)
          workerRef.current?.removeEventListener('message', handleMessage)
          reject(data.error)
        } 
        else if (data.type === 'complete' && 'base64' in data) {
          setIsProcessing(false)
          setProgress(1)
          workerRef.current?.removeEventListener('message', handleMessage)
          resolve(data.base64)
        }
      }
      
      workerRef.current.addEventListener('message', handleMessage)
      workerRef.current.postMessage({
        action: 'encode',
        base64Data: data
      })
    })
  }

  // Decode base64 to binary
  const decodeFromBase64 = (base64: string, mimeType?: string): Promise<{ bytes: Uint8Array, detectedType: string }> => {
    resetState()
    
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        setIsProcessing(false)
        reject('Web Workers are not supported in your browser')
        return
      }
      
      const handleMessage = (e: MessageEvent<WorkerMessage>) => {
        const data = e.data
        
        if (data.type === 'progress') {
          setProgress(data.progress)
        } 
        else if (data.type === 'error') {
          setIsProcessing(false)
          setError(data.error)
          workerRef.current?.removeEventListener('message', handleMessage)
          reject(data.error)
        } 
        else if (data.type === 'complete' && 'bytes' in data) {
          setIsProcessing(false)
          setProgress(1)
          workerRef.current?.removeEventListener('message', handleMessage)
          resolve({
            bytes: data.bytes,
            detectedType: data.detectedType
          })
        }
      }
      
      workerRef.current.addEventListener('message', handleMessage)
      workerRef.current.postMessage({
        action: 'decode',
        base64Data: base64,
        mimeType
      })
    })
  }
  
  // Cancel current operation
  const cancelOperation = () => {
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = new Worker('/base64-worker.js')
      setIsProcessing(false)
      setError('Operation cancelled')
    }
  }

  return {
    encodeToBase64,
    decodeFromBase64,
    cancelOperation,
    isProcessing,
    progress,
    error
  }
}
