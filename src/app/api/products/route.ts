import { NextRequest, NextResponse } from 'next/server';

import { connectDB } from '@/lib/mongodb';
import { findBrandBySlug, findLineaBySlug } from '@/lib/product-catalog';
import { serializePublicProduct } from '@/lib/public-product';
import Product from '@/models/Product';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ciExact(value: string) {
  return new RegExp(`^${escapeRegex(value.trim())}$`, 'i');
}

/**
 * Catalogo pubblico prodotti.
 * GET /api/products — tutti i prodotti (non eliminati).
 * GET /api/products?marca=chris-nails — per brand (slug).
 * GET /api/products?marca=chris-nails&linea=gel — brand + sottocategoria (slug).
 * GET /api/products?linea=gel — solo linea (slug univoco nel catalogo).
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const marcaSlug = sp.get('marca')?.trim().toLowerCase() || sp.get('brand')?.trim().toLowerCase() || '';
  const lineaSlug = sp.get('linea')?.trim().toLowerCase() || sp.get('sottocategoria')?.trim().toLowerCase() || '';

  try {
    await connectDB();

    const filter: Record<string, unknown> = {};

    if (lineaSlug && marcaSlug) {
      const brand = findBrandBySlug(marcaSlug);
      const linea = findLineaBySlug(lineaSlug);
      if (!brand || !linea || linea.brandSlug !== marcaSlug) {
        return NextResponse.json({ error: 'Marca o linea non valida.' }, { status: 400 });
      }
      filter.brand = ciExact(brand.title);
      filter.type = ciExact(linea.dbType);
    } else if (lineaSlug) {
      const linea = findLineaBySlug(lineaSlug);
      if (!linea) {
        return NextResponse.json({ error: 'Linea non valida.' }, { status: 400 });
      }
      filter.brand = ciExact(linea.brandTitle);
      filter.type = ciExact(linea.dbType);
    } else if (marcaSlug) {
      const brand = findBrandBySlug(marcaSlug);
      if (!brand) {
        return NextResponse.json({ error: 'Marca non valida.' }, { status: 400 });
      }
      filter.brand = ciExact(brand.title);
    }

    const docs = await Product.find(filter).sort({ name: 1 }).lean();
    const data = docs.map((doc) =>
      serializePublicProduct({
        _id: doc._id,
        name: doc.name,
        description: doc.description,
        cost: doc.cost,
        media: doc.media,
        brand: doc.brand,
        type: doc.type,
      })
    );

    return NextResponse.json(data);
  } catch (err) {
    console.error('Public products GET error:', err);
    return NextResponse.json({ error: 'Errore nel caricamento dei prodotti.' }, { status: 500 });
  }
}
