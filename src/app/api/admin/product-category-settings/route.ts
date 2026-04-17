import { NextRequest, NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin';
import { getProductCategoryDisabledKeys, setProductCategoryDisabledKeys } from '@/lib/product-category-settings-store';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const disabledKeys = await getProductCategoryDisabledKeys();
    return NextResponse.json({ disabledKeys });
  } catch (err) {
    console.error('admin product-category-settings GET:', err);
    return NextResponse.json({ error: 'Errore nel caricamento.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const disabledKeys = await setProductCategoryDisabledKeys(body.disabledKeys);
    return NextResponse.json({ disabledKeys });
  } catch (err) {
    console.error('admin product-category-settings PUT:', err);
    return NextResponse.json({ error: 'Errore nel salvataggio.' }, { status: 500 });
  }
}
