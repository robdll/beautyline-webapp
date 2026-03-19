import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, setAuthCookies, generateVerificationToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password sono obbligatori.' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenziali non valide.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenziali non valide.' },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      const token = generateVerificationToken();
      user.verificationToken = token;
      user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();
      try {
        await sendVerificationEmail(user.email, token);
      } catch (emailError) {
        console.error('Signin resend verification error:', emailError);
        return NextResponse.json(
          {
            error:
              emailError instanceof Error
                ? emailError.message
                : 'Account non verificato, ma invio email di verifica fallito.',
          },
          { status: 502 }
        );
      }

      return NextResponse.json(
        { error: 'Account non verificato. Una nuova email di verifica è stata inviata.' },
        { status: 403 }
      );
    }

    await setAuthCookies({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}
