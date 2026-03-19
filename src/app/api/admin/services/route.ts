import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import Service from '@/models/Service';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const services = await Service.find().lean();
    const serialized = services.map((s) => ({
      ...s,
      _id: s._id.toString(),
    }));
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Services GET error:', err);
    return NextResponse.json({ error: 'Errore nel recupero dei servizi.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { type, name, description, media, cost } = body;

    if (!type || !name || !description || cost === undefined) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: type, name, description, cost.' },
        { status: 400 }
      );
    }

    const numCost = Number(cost);
    if (isNaN(numCost) || numCost < 0) {
      return NextResponse.json({ error: 'Il costo deve essere un numero non negativo.' }, { status: 400 });
    }

    await connectDB();
    const service = await Service.create({
      type: String(type).trim(),
      name: String(name).trim(),
      description: String(description),
      media: Array.isArray(media) ? media : [],
      cost: numCost,
    });

    const serialized = {
      ...service.toObject(),
      _id: service._id.toString(),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Services POST error:', err);
    return NextResponse.json({ error: 'Errore nella creazione del servizio.' }, { status: 500 });
  }
}
