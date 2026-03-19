import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ error: 'Non autenticato.' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select(
      '-passwordHash -verificationToken -verificationTokenExpiry'
    );

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato.' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ error: 'Non autenticato.' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, address } = body;

    await connectDB();
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato.' }, { status: 404 });
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (address) {
      if (address.street !== undefined) user.address.street = address.street;
      if (address.streetNumber !== undefined) user.address.streetNumber = address.streetNumber;
      if (address.postalCode !== undefined) user.address.postalCode = address.postalCode;
      if (address.city !== undefined) user.address.city = address.city;
      if (address.province !== undefined) user.address.province = address.province;
    }

    await user.save();

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ error: 'Errore interno del server.' }, { status: 500 });
  }
}
