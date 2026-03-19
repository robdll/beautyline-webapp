import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import Equipment from '@/models/Equipment';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const equipment = await Equipment.find().lean();
    const serialized = equipment.map((e) => ({
      ...e,
      _id: e._id.toString(),
    }));
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Equipment GET error:', err);
    return NextResponse.json({ error: 'Errore nel recupero delle attrezzature.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { type, name, description, media, rentOnly, rentCostPerDay, rentCostPerMonth, sellingCost } = body;

    if (!type || !name || !description) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: type, name, description.' },
        { status: 400 }
      );
    }

    const numRentDay = Number(rentCostPerDay);
    const numRentMonth = Number(rentCostPerMonth);
    const numSelling = Number(sellingCost);

    if (isNaN(numRentDay) || numRentDay < 0) {
      return NextResponse.json({ error: 'Costo noleggio giornaliero non valido.' }, { status: 400 });
    }
    if (isNaN(numRentMonth) || numRentMonth < 0) {
      return NextResponse.json({ error: 'Costo noleggio mensile non valido.' }, { status: 400 });
    }
    if (isNaN(numSelling) || numSelling < 0) {
      return NextResponse.json({ error: 'Prezzo di vendita non valido.' }, { status: 400 });
    }

    await connectDB();
    const equipment = await Equipment.create({
      type: String(type).trim(),
      name: String(name).trim(),
      description: String(description),
      media: Array.isArray(media) ? media : [],
      rentOnly: Boolean(rentOnly),
      rentCostPerDay: numRentDay,
      rentCostPerMonth: numRentMonth,
      sellingCost: numSelling,
    });

    const serialized = {
      ...equipment.toObject(),
      _id: equipment._id.toString(),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Equipment POST error:', err);
    return NextResponse.json({ error: 'Errore nella creazione dell\'attrezzatura.' }, { status: 500 });
  }
}
