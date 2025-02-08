'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setVideoUri(data.uri);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    try {
      await fetch(`/api/video/${videoId}`, {
        method: 'DELETE',
      });
      setVideoUri(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Video Upload</h1>
      
      <div className="space-y-4">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full"
        />
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>

        {videoUri && (
          <div className="mt-4">
            <h2 className="text-xl mb-2">Uploaded Video</h2>
            <div className="aspect-video">
              <iframe
                src={`https://player.vimeo.com/video/${videoUri.split('/').pop()}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
              />
            </div>
            <button
              onClick={() => handleDelete(videoUri.split('/').pop()!)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
