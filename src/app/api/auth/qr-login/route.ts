import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth/session';
import { authAdapter } from '@/lib/auth/adapter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sector = searchParams.get('sector') || 'srmist';
  const role = searchParams.get('role') || 'worker';
  const name = searchParams.get('name') || undefined;

  // Verify and construct user profile
  const authResult = await authAdapter.verifyOtp('+91 99999 88888', '777888', {
    sectorId: sector,
    role,
    name,
  });

  if (!authResult.success || !authResult.user) {
    return NextResponse.redirect(new URL('/login/sector', request.url));
  }

  const sessionToken = await createSessionToken(authResult.user);

  // Target landing route depending on role
  let targetPath = '/app';
  if (authResult.user.role === 'contractor') {
    targetPath = '/contractor';
  } else if (authResult.user.role === 'admin') {
    targetPath = '/admin';
  }

  const response = NextResponse.redirect(new URL(targetPath, request.url));

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  });

  return response;
}
