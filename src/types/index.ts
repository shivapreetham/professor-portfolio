// types/index.ts
export interface Video {
    id: string;
    title: string;
    embedUrl: string;
    createdAt: string;
    duration: number;
  }
  
  export interface UploadResponse {
    success: boolean;
    video: Video;
    error?: string;
  }
  
  export interface ApiError {
    error: string;
    statusCode: number;
  }