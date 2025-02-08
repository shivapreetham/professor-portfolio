import { NextResponse } from 'next/server';
import { uploadVideo } from '@/lib/vimeo';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (optional)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds limit (500MB)' }, 
        { status: 413 }
      );
    }

    // Validate file type (optional)
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, MOV, and AVI are allowed.' }, 
        { status: 400 }
      );
    }

    const uri = await uploadVideo(file);
    return NextResponse.json({ uri });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' }, 
      { status: 500 }
    );
  }
}

// Optional: Configure segment config
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500mb'
    },
  },
};
