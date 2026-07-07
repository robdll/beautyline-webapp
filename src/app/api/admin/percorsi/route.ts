import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import { isDuplicateKeyError } from '@/lib/mongo-errors';
import { resolvePercorsoItems } from '@/lib/percorso-items';
import Percorso from '@/models/Percorso';

function serialize(doc: {
  _id: unknown;
  name: string;
  description: string;
  cost: number;
  media?: unknown;
  items?: unknown;
}) {
  const items = Array.isArray(doc.items) ? doc.items : [];
  return {
    ...doc,
    _id: String(doc._id),
    media: Array.isArray(doc.media) ? doc.media : [],
    items: items.map((item) => {
      const it = item as { course?: unknown; startDate?: unknown; endDate?: unknown };
      const start = it.startDate ? new Date(it.startDate as string | Date) : null;
      const end = it.endDate ? new Date(it.endDate as string | Date) : null;
      return {
        courseId: String(it.course ?? ''),
        startDate: start && !Number.isNaN(start.getTime()) ? start.toISOString().slice(0, 10) : '',
        endDate: end && !Number.isNaN(end.getTime()) ? end.toISOString().slice(0, 10) : '',
      };
    }),
  };
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const percorsi = await Percorso.find().sort({ createdAt: 1 }).lean();
    return NextResponse.json(percorsi.map((p) => serialize(p)));
  } catch (err) {
    console.error('Percorsi GET error:', err);
    return NextResponse.json({ error: 'Errore nel recupero dei percorsi.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { name, description, cost, media, items } = body;

    if (!name || !description || cost === undefined) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: name, description, cost.' },
        { status: 400 }
      );
    }

    const numCost = Number(cost);
    if (isNaN(numCost) || numCost < 0) {
      return NextResponse.json({ error: 'Il costo deve essere un numero non negativo.' }, { status: 400 });
    }

    await connectDB();
    const itemsResult = await resolvePercorsoItems(items);
    if (!itemsResult.ok) {
      return NextResponse.json({ error: itemsResult.error }, { status: 400 });
    }

    const percorso = await Percorso.create({
      name: String(name).trim(),
      description: String(description),
      cost: numCost,
      media: Array.isArray(media) ? media : [],
      items: itemsResult.items,
    });

    return NextResponse.json(serialize(percorso.toObject()));
  } catch (err) {
    console.error('Percorsi POST error:', err);
    if (isDuplicateKeyError(err)) {
      return NextResponse.json(
        { error: 'Esiste già un percorso con un nome/URL simile. Modifica leggermente il nome.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Errore nella creazione del percorso.' }, { status: 500 });
  }
}
