import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(`${appUrl}/verify?error=missing-token`);
    }

    await connectDB();

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(`${appUrl}/verify?error=invalid-token`);
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.redirect(`${appUrl}/verify?verified=true`);
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.redirect(`${appUrl}/verify?error=server-error`);
  }
}
