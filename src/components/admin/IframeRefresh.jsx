'use client'

import { useEffect, useRef } from 'react'
import { useDataSync } from '@/contexts/DataSyncContext'

export default function IframeRefresh({ src, className, ...props }) {
  const iframeRef = useRef(null)
  const { setIframeRef, registerRefreshCallback } = useDataSync()

  useEffect(() => {
    if (iframeRef.current) {
      setIframeRef(iframeRef.current)
    }
  }, [setIframeRef])

  useEffect(() => {
    // Register a refresh callback for this iframe
    const unregister = registerRefreshCallback(() => {
      if (iframeRef.current) {
        // Force reload the iframe
        const currentSrc = iframeRef.current.src
        iframeRef.current.src = ''
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = currentSrc
          }
        }, 100)
      }
    })

    return unregister
  }, [registerRefreshCallback])

  return (
    <iframe
      ref={iframeRef}
      src={src}
      className={className}
      {...props}
      onLoad={() => {
        // Send initial message to iframe about parent context
        if (iframeRef.current?.contentWindow) {
          try {
            iframeRef.current.contentWindow.postMessage({
              type: 'ADMIN_CONTEXT',
              message: 'Connected to admin panel'
            }, '*')
          } catch (error) {
            console.log('Could not send message to iframe:', error)
          }
        }
      }}
    />
  )
}