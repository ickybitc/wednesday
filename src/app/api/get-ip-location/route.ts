import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'Unknown IP';
    
    // Get location data from ipapi.co
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const locationData = await response.json();
    
    return NextResponse.json(locationData);
  } catch (error) {
    console.error('Error getting location:', error);
    return NextResponse.json({ error: 'Failed to get location' }, { status: 500 });
  }
} 