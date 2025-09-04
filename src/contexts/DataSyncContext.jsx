'use client'

import { createContext, useContext, useCallback, useRef } from 'react'

const DataSyncContext = createContext({})

export const useDataSync = () => {
  const context = useContext(DataSyncContext)
  if (!context) {
    throw new Error('useDataSync must be used within a DataSyncProvider')
  }
  return context
}

export function DataSyncProvider({ children }) {
  const iframeRef = useRef(null)
  const refreshCallbacks = useRef(new Set())

  // Register a callback to be called when data updates
  const registerRefreshCallback = useCallback((callback) => {
    refreshCallbacks.current.add(callback)
    
    // Return cleanup function
    return () => {
      refreshCallbacks.current.delete(callback)
    }
  }, [])

  // Trigger refresh for all registered callbacks
  const triggerRefresh = useCallback(() => {
    refreshCallbacks.current.forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('Error in refresh callback:', error)
      }
    })
    
    // Also refresh iframe if it exists
    if (iframeRef.current) {
      try {
        // Send message to iframe to refresh
        iframeRef.current.contentWindow?.postMessage({ type: 'REFRESH_DATA' }, '*')
      } catch (error) {
        // If postMessage fails, force reload the iframe
        const src = iframeRef.current.src
        iframeRef.current.src = ''
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = src
          }
        }, 100)
      }
    }
  }, [])

  // Set iframe reference
  const setIframeRef = useCallback((iframe) => {
    iframeRef.current = iframe
  }, [])

  // Refresh specific data type
  const refreshDataType = useCallback((dataType) => {
    // Notify specific data type refresh
    refreshCallbacks.current.forEach(callback => {
      try {
        if (callback.dataType === dataType || !callback.dataType) {
          callback()
        }
      } catch (error) {
        console.error('Error in refresh callback:', error)
      }
    })

    // Send specific refresh message to iframe
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.postMessage({ 
          type: 'REFRESH_DATA', 
          dataType 
        }, '*')
      } catch (error) {
        console.error('Error sending message to iframe:', error)
      }
    }
  }, [])

  const value = {
    registerRefreshCallback,
    triggerRefresh,
    refreshDataType,
    setIframeRef,
  }

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  )
}