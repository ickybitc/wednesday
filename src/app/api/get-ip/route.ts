import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : request.ip || 'Unknown IP';
  
  return NextResponse.json({ ip });
} 