import { NextResponse } from 'next/server';
import { deleteVideo, getVideo } from '@/lib/vimeo';

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const video = await getVideo(params.videoId);
    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    await deleteVideo(params.videoId);
    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}