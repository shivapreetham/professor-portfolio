'use client'

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDataSync } from "@/contexts/DataSyncContext";

const MobilePreview = () => {
  const { user } = useAuth();
  const { setIframeRef } = useDataSync();
  const iframeRef = useRef(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Register iframe with DataSync context for controlled refreshes
  useEffect(() => {
    if (iframeRef.current) {
      setIframeRef(iframeRef.current);
    }
  }, [setIframeRef]);

  const previewUrl = user?.id 
    ? `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/preview/${user.id}`
    : 'about:blank';

  // Debug log
  useEffect(() => {
    if (user?.id) {
      console.log('Preview URL:', previewUrl);
      console.log('User ID:', user.id);
    }
  }, [previewUrl, user?.id]);

  return (
    <div className="p-2 md:fixed">
      {/* Mobile container styled to look like a mobile device */}
      <div className="relative border-[13px] min-w-[340px] w-full max-w-[400px] max-h-[650px] border-black h-screen rounded-[40px] m-2 shadow-md shadow-primary">
        <div className="bg-warning text-warning-content text-xs p-1 text-center rounded-t-[27px]">
          LIVE PREVIEW
        </div>
        {/* Loading State */}
        {iframeLoading && user?.id && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100 rounded-b-[27px]">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-2 text-sm">Loading preview...</p>
            </div>
          </div>
        )}
        
        {/* Debug Info */}
        {!user?.id && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100 rounded-b-[27px]">
            <div className="text-center p-4">
              <p className="text-sm text-error">No user ID found</p>
              <p className="text-xs text-base-content/60 mt-2">Please login to see preview</p>
            </div>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          title="Mobile Preview" 
          src={previewUrl}
          className="w-full rounded-b-[27px] border-0"
          style={{ 
            height: 'calc(100% - 32px)', 
            minHeight: '500px'
          }}
          onLoad={() => setIframeLoading(false)}
          onError={() => setIframeLoading(false)}
        />
      </div>
    </div>
  );
};

export default MobilePreview;
