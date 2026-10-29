import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth/session';
import { authAdapter } from '@/lib/auth/adapter';
import { z } from 'zod';

const LoginRequestSchema = z.object({
  type: z.enum(['otp', 'qr', 'demo', 'admin']),
  phone: z.string().optional(),
  code: z.string().optional(),
  qrPayload: z.string().optional(),
  sectorId: z.string().default('srmist'),
  role: z.string().default('worker'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LoginRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid login parameters' }, { status: 400 });
    }

    const { type, phone, code, qrPayload, sectorId, role, name } = parsed.data;

    let authResult;

    if (type === 'qr' && qrPayload) {
      authResult = await authAdapter.verifyQrBadge(qrPayload, { name });
    } else if (type === 'otp' || type === 'demo') {
      const otpCode = code || (type === 'demo' ? '777888' : '');
      authResult = await authAdapter.verifyOtp(phone || '+91 98765 43210', otpCode, {
        sectorId,
        role,
        name,
      });
    } else if (type === 'admin') {
      authResult = await authAdapter.verifyOtp(phone || '+91 90000 00001', code || '777888', {
        sectorId: sectorId || 'srmist',
        role: 'admin',
        name: name || 'Principal Workplace Inspector',
      });
    } else {
      return NextResponse.json({ success: false, error: 'Unsupported authentication method' }, { status: 400 });
    }

    if (!authResult || !authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult?.error || 'Authentication failed' },
        { status: 401 }
      );
    }

    const sessionToken = await createSessionToken(authResult.user);

    const response = NextResponse.json({
      success: true,
      user: authResult.user,
    });

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
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal login error' }, { status: 500 });
  }
}
