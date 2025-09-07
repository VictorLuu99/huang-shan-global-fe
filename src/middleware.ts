import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// No locale-based routing - Redux handles language state
export function middleware(request: NextRequest) {
  // Let all requests pass through without locale redirects
  return NextResponse.next();
}

export const config = {
  // Only needed for specific API routes or special handling
  matcher: []
};