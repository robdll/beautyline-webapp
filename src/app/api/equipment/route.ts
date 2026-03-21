import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { parseEquipmentType } from '@/lib/equipment-types';
import { equipmentTypeMatchValues } from '@/lib/equipment-queries';
import { serializePublicEquipment, type LeanEquipmentDoc } from '@/lib/public-equipment';
import Equipment from '@/models/Equipment';

function readItemId(sp: URLSearchParams): string {
  return (
    sp.get('attrezzatura')?.trim() ||
    sp.get('item')?.trim() ||
    sp.get('id')?.trim() ||
    ''
  );
}

/**
 * Catalogo pubblico attrezzature.
 * GET /api/equipment?type=… | ?tipo=… — elenco per categoria
 * GET /api/equipment?attrezzatura=<id> [&tipo=…] — singola attrezzatura
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const itemId = readItemId(sp);
  const tipoHint = parseEquipmentType(sp.get('type') ?? sp.get('tipo'));

  if (itemId) {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json({ error: 'ID non valido.' }, { status: 400 });
    }
    try {
      await connectDB();
      const raw = await Equipment.findById(itemId).lean();
      if (!raw) {
        return NextResponse.json({ error: 'Attrezzatura non trovata.' }, { status: 404 });
      }
      const item = serializePublicEquipment(raw as LeanEquipmentDoc);
      if (!item) {
        return NextResponse.json({ error: 'Attrezzatura non trovata.' }, { status: 404 });
      }
      if (tipoHint && item.type !== tipoHint) {
        return NextResponse.json({ error: 'Attrezzatura non trovata.' }, { status: 404 });
      }
      return NextResponse.json(item);
    } catch (err) {
      console.error('Public equipment GET by id error:', err);
      return NextResponse.json({ error: 'Errore nel caricamento.' }, { status: 500 });
    }
  }

  const typeParam = parseEquipmentType(sp.get('type') ?? sp.get('tipo'));
  if (!typeParam) {
    return NextResponse.json(
      {
        error:
          'Parametro type o tipo richiesto (viso, corpo, epilazione, multifunzione), oppure attrezzatura (id).',
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const docs = await Equipment.find({ type: { $in: equipmentTypeMatchValues(typeParam) } })
      .sort({ name: 1 })
      .lean();
    const data = docs
      .map((d) => serializePublicEquipment(d as LeanEquipmentDoc))
      .filter((x): x is NonNullable<typeof x> => x !== null);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Public equipment GET error:', err);
    return NextResponse.json({ error: 'Errore nel caricamento delle attrezzature.' }, { status: 500 });
  }
}
