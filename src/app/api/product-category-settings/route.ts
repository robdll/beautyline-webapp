import { NextResponse } from 'next/server';

import { getProductCategoryDisabledKeys } from '@/lib/product-category-settings-store';

/** Lettura pubblica: quali sottocategorie sono disattivate (solo slug). */
export async function GET() {
  try {
    const disabledKeys = await getProductCategoryDisabledKeys();
    return NextResponse.json({ disabledKeys });
  } catch (err) {
    console.error('product-category-settings GET:', err);
    return NextResponse.json({ error: 'Errore nel caricamento.' }, { status: 500 });
  }
}
