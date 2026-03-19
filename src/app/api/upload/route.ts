import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato.' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nessun file caricato.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = (formData.get('folder') as string) || 'beautyline';
    const url = await uploadToCloudinary(buffer, folder);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    const details =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : undefined;

    return NextResponse.json({ error: 'Errore nel caricamento.', details }, { status: 500 });
  }
}
