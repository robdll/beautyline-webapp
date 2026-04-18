import { NextRequest, NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin';
import {
  getListinoPrezziUrl,
  normalizeListinoPrezziUrlInput,
  setListinoPrezziUrl,
} from '@/lib/estetica-public-settings-store';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const listinoPrezziUrl = await getListinoPrezziUrl();
    return NextResponse.json({ listinoPrezziUrl });
  } catch (err) {
    console.error('admin estetica-public-settings GET:', err);
    return NextResponse.json({ error: 'Errore nel caricamento.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const raw = body?.listinoPrezziUrl;
    if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
      if (!normalizeListinoPrezziUrlInput(raw)) {
        return NextResponse.json(
          { error: 'URL listino non valido (solo HTTPS consentito).' },
          { status: 400 }
        );
      }
    }
    const listinoPrezziUrl = await setListinoPrezziUrl(raw);
    return NextResponse.json({ listinoPrezziUrl });
  } catch (err) {
    console.error('admin estetica-public-settings PUT:', err);
    return NextResponse.json({ error: 'Errore nel salvataggio.' }, { status: 500 });
  }
}
