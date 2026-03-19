import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateVerificationToken } from '@/lib/auth';
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

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La password deve avere almeno 8 caratteri.' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const token = generateVerificationToken();
        existingUser.verificationToken = token;
        existingUser.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await existingUser.save();
        await sendVerificationEmail(existingUser.email, token);

        return NextResponse.json(
          { message: 'Un\'email di verifica è stata inviata al tuo indirizzo.' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Un account con questa email esiste già.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = generateVerificationToken();

    await User.create({
      email: email.toLowerCase(),
      passwordHash,
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendVerificationEmail(email.toLowerCase(), verificationToken);

    return NextResponse.json(
      { message: 'Registrazione completata. Controlla la tua email per verificare l\'account.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}
