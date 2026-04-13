import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import Service from '@/models/Service';
import { buildServicePayloadFromBody } from '@/lib/service-api';

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
    const payload = buildServicePayloadFromBody(body);
    if ('error' in payload) {
      return NextResponse.json({ error: payload.error }, { status: 400 });
    }

    await connectDB();
    const service = await Service.create(payload);

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
