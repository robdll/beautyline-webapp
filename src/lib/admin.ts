import { NextResponse } from 'next/server';
import { getAuthUser } from './auth';

export async function requireAdmin() {
  const user = await getAuthUser();
  if (!user) {
    return { error: NextResponse.json({ error: 'Non autenticato.' }, { status: 401 }), user: null };
  }
  if (user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Non autorizzato.' }, { status: 403 }), user: null };
  }
  return { error: null, user };
}
