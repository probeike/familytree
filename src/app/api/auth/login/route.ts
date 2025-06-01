import { NextRequest, NextResponse } from 'next/server';

// Simple password from environment variable
const FAMILY_TREE_PASSWORD = process.env.FAMILY_TREE_PASSWORD || '';

/**
 * Authenticate user with password (server-side)
 */
function authenticateWithPassword(password: string): boolean {
  if (!password || !FAMILY_TREE_PASSWORD) {
    return false;
  }

  return password === FAMILY_TREE_PASSWORD;
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 });
    }

    const isValid = authenticateWithPassword(password);
    
    if (isValid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}