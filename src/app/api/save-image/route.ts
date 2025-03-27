import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { image, timestamp } = await request.json();
    
    // Remove the data URL prefix to get the base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create a directory for the images if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'captured-images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Save the image with timestamp
    const filename = `picture-${timestamp}.png`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Image saved successfully',
      filename: filename
    });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save image' 
    }, { status: 500 });
  }
} 