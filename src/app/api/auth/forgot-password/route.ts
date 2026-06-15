import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import {
  generateVerificationToken,
  hashOpaqueToken,
  PASSWORD_RESET_EXPIRY_MS,
} from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import { enforceRateLimits } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';

const GENERIC_SUCCESS_MESSAGE =
  'Se l\'account esiste, riceverai un\'email con le istruzioni per reimpostare la password.';

const FORGOT_PASSWORD_WINDOW_SEC = 60 * 60;
const FORGOT_PASSWORD_EMAIL_LIMIT = 3;
const FORGOT_PASSWORD_IP_LIMIT = 10;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email) {
      return NextResponse.json(
        { error: 'Email obbligatoria.' },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    const rateLimit = await enforceRateLimits([
      {
        key: `forgot-password:email:${email}`,
        limit: FORGOT_PASSWORD_EMAIL_LIMIT,
        windowSec: FORGOT_PASSWORD_WINDOW_SEC,
      },
      {
        key: `forgot-password:ip:${clientIp}`,
        limit: FORGOT_PASSWORD_IP_LIMIT,
        windowSec: FORGOT_PASSWORD_WINDOW_SEC,
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

    const user = await User.findOne({ email });

    if (user) {
      const token = generateVerificationToken();
      user.passwordResetToken = hashOpaqueToken(token);
      user.passwordResetExpiry = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MS);
      await user.save();

      try {
        await sendPasswordResetEmail(user.email, token);
      } catch (emailError) {
        console.error('Forgot password email error:', emailError);
        user.passwordResetToken = undefined;
        user.passwordResetExpiry = undefined;
        await user.save();
        return NextResponse.json(
          {
            error:
              emailError instanceof Error
                ? emailError.message
                : 'Impossibile inviare l\'email di recupero password.',
          },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ message: GENERIC_SUCCESS_MESSAGE });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}
