import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import { isDuplicateKeyError } from '@/lib/mongo-errors';
import { resolveEquipmentPromoItems } from '@/lib/equipment-promo-items';
import { serializePromoPackage } from '@/lib/admin-equipment-promo';
import EquipmentPromoPackage from '@/models/EquipmentPromoPackage';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const packages = await EquipmentPromoPackage.find().sort({ createdAt: 1 }).lean();
    return NextResponse.json(packages.map((p) => serializePromoPackage(p)));
  } catch (err) {
    console.error('Pacchetti attrezzature GET error:', err);
    return NextResponse.json(
      { error: 'Errore nel recupero dei pacchetti.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
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
    const pkg = await EquipmentPromoPackage.create({
      name: String(name).trim(),
      description: String(description),
      details: typeof details === 'string' ? details : '',
      annualPrice: numPrice,
      badge: typeof badge === 'string' ? badge.trim() : '',
      media: Array.isArray(media) ? media : [],
      equipmentIds: itemsResult.ids,
    });

    return NextResponse.json(serializePromoPackage(pkg.toObject()));
  } catch (err) {
    console.error('Pacchetti attrezzature POST error:', err);
    if (isDuplicateKeyError(err)) {
      return NextResponse.json(
        { error: 'Esiste già un pacchetto con un nome/URL simile. Modifica leggermente il nome.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Errore nella creazione del pacchetto.' }, { status: 500 });
  }
}
