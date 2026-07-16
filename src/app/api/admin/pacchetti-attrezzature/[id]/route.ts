import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import { isDuplicateKeyError } from '@/lib/mongo-errors';
import { resolveEquipmentPromoItems } from '@/lib/equipment-promo-items';
import { serializePromoPackage } from '@/lib/admin-equipment-promo';
import EquipmentPromoPackage from '@/models/EquipmentPromoPackage';

export async function GET(
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
    const pkg = await EquipmentPromoPackage.findById(id).lean();
    if (!pkg) {
      return NextResponse.json({ error: 'Pacchetto non trovato.' }, { status: 404 });
    }

    return NextResponse.json(serializePromoPackage(pkg));
  } catch (err) {
    console.error('Pacchetto GET error:', err);
    return NextResponse.json({ error: 'Errore nel recupero del pacchetto.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID non valido.' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, details, annualPrice, badge, media, equipmentIds } = body;

    if (!name || !description || annualPrice === undefined) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: name, description, annualPrice.' },
        { status: 400 }
      );
    }

    const numPrice = Number(annualPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json(
        { error: 'Il prezzo annuo deve essere un numero non negativo.' },
        { status: 400 }
      );
    }

    const itemsResult = await resolveEquipmentPromoItems(equipmentIds);
    if (!itemsResult.ok) {
      return NextResponse.json({ error: itemsResult.error }, { status: 400 });
    }

    await connectDB();
    const pkg = await EquipmentPromoPackage.findById(id);
    if (!pkg) {
      return NextResponse.json({ error: 'Pacchetto non trovato.' }, { status: 404 });
    }

    pkg.name = String(name).trim();
    pkg.description = String(description);
    pkg.details = typeof details === 'string' ? details : '';
    pkg.annualPrice = numPrice;
    pkg.badge = typeof badge === 'string' ? badge.trim() : '';
    pkg.media = Array.isArray(media) ? media : [];
    pkg.equipmentIds = itemsResult.ids.map((eid) => new mongoose.Types.ObjectId(eid));

    await pkg.save();

    return NextResponse.json(serializePromoPackage(pkg.toObject()));
  } catch (err) {
    console.error('Pacchetto PUT error:', err);
    if (isDuplicateKeyError(err)) {
      return NextResponse.json(
        { error: 'Esiste già un pacchetto con un nome/URL simile. Modifica leggermente il nome.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Errore nell\'aggiornamento del pacchetto.' }, { status: 500 });
  }
}

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
    const pkg = await EquipmentPromoPackage.findById(id);
    if (!pkg) {
      return NextResponse.json({ error: 'Pacchetto non trovato.' }, { status: 404 });
    }

    await pkg.softDelete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Pacchetto DELETE error:', err);
    return NextResponse.json({ error: 'Errore nell\'eliminazione del pacchetto.' }, { status: 500 });
  }
}
