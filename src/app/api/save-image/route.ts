import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    
    // Here you would typically save the image to a storage service
    // For now, we'll just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save image' }, { status: 500 });
  }
} 