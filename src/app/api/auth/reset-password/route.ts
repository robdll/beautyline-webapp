import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { hashOpaqueToken, hashPassword } from '@/lib/auth';
import { enforceRateLimits } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';

const RESET_PASSWORD_WINDOW_SEC = 60 * 60;
const RESET_PASSWORD_IP_LIMIT = 10;

function isValidToken(token: string | null): token is string {
  return typeof token === 'string' && token.length >= 32 && token.length <= 128;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!isValidToken(token)) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({
      passwordResetToken: hashOpaqueToken(token),
      passwordResetExpiry: { $gt: new Date() },
    });

    return NextResponse.json({ valid: Boolean(user) });
  } catch (error) {
    console.error('Reset password validate error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const token = typeof body?.token === 'string' ? body.token : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!isValidToken(token)) {
      return NextResponse.json(
        { error: 'Link di recupero non valido o scaduto.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'La password deve avere almeno 8 caratteri.' },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    const rateLimit = await enforceRateLimits([
      {
        key: `reset-password:ip:${clientIp}`,
        limit: RESET_PASSWORD_IP_LIMIT,
        windowSec: RESET_PASSWORD_WINDOW_SEC,
      },
    ]);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Troppe richieste. Riprova tra ${rateLimit.retryAfterSec} secondi.`,
        },
        { status: 429 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      passwordResetToken: hashOpaqueToken(token),
      passwordResetExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Link di recupero non valido o scaduto.' },
        { status: 400 }
      );
    }

    user.passwordHash = await hashPassword(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: 'Password aggiornata con successo. Ora puoi accedere.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}
