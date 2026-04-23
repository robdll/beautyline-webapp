import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import CoursePoster from '@/models/CoursePoster';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID non valido.' }, { status: 400 });
    }

    await connectDB();
    const poster = await CoursePoster.findById(id);
    if (!poster) {
      return NextResponse.json({ error: 'Locandina non trovata.' }, { status: 404 });
    }

    await poster.softDelete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('CoursePoster DELETE error:', err);
    return NextResponse.json({ error: 'Errore nell\'eliminazione della locandina.' }, { status: 500 });
  }
}
