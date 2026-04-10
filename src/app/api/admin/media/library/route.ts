import { NextRequest, NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin';
import { listCloudinaryLibraryImages } from '@/lib/cloudinary';
import { isValidCloudinaryFolderPrefix } from '@/lib/media-folder';

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const folder = request.nextUrl.searchParams.get('folder')?.trim() ?? '';
  const cursor = request.nextUrl.searchParams.get('cursor')?.trim() || undefined;
  const limitRaw = request.nextUrl.searchParams.get('limit');
  let limit = DEFAULT_LIMIT;
  if (limitRaw != null && limitRaw !== '') {
    const n = parseInt(limitRaw, 10);
    if (!isNaN(n)) limit = Math.min(Math.max(n, 1), MAX_LIMIT);
  }

  if (!isValidCloudinaryFolderPrefix(folder)) {
    return NextResponse.json({ error: 'Cartella non valida.' }, { status: 400 });
  }

  try {
    const { items, nextCursor } = await listCloudinaryLibraryImages({
      folderPrefix: folder,
      maxResults: limit,
      nextCursor: cursor || null,
    });

    return NextResponse.json({
      images: items.map((i) => ({ url: i.url, publicId: i.publicId })),
      nextCursor,
    });
  } catch (err) {
    console.error('Media library GET error:', err);
    const message = err instanceof Error ? err.message : '';
    const missingConfig = message.includes('environment variables');
    return NextResponse.json(
      {
        error: missingConfig
          ? 'Cloudinary non configurato.'
          : 'Impossibile caricare la libreria immagini.',
      },
      { status: missingConfig ? 503 : 500 }
    );
  }
}
