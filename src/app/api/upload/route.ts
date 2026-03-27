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
    const publicIdRaw = (formData.get('publicId') as string) || '';
    const publicId = publicIdRaw.trim();
    const resourceTypeRaw = ((formData.get('resourceType') as string) || 'auto').trim();
    const formatRaw = ((formData.get('format') as string) || '').trim();

    const normalizedResourceType =
      resourceTypeRaw === 'image' || resourceTypeRaw === 'raw' || resourceTypeRaw === 'video'
        ? resourceTypeRaw
        : 'auto';

    const url = await uploadToCloudinary(buffer, folder, {
      publicId: publicId.length > 0 ? publicId : undefined,
      resourceType: normalizedResourceType,
      format: formatRaw.length > 0 ? formatRaw : undefined,
    });

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
