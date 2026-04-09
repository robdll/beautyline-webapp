import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
/** Access JWT lifetime and `access_token` cookie max-age (seconds). */
const ACCESS_TOKEN_MAX_AGE_SEC = 2 * 60 * 60;
const REFRESH_TOKEN_EXPIRY = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + ACCESS_TOKEN_MAX_AGE_SEC * 1000))
    .sign(JWT_SECRET);
}

export async function signRefreshToken(payload: JWTPayload): Promise<string> {
  const refreshSecret = new TextEncoder().encode(
    process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'
  );
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const refreshSecret = new TextEncoder().encode(
      process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'
    );
    const { payload } = await jwtVerify(token, refreshSecret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Pure resolution from cookie string values (no Next.js cookies()).
 * `rotated` is true when the access token was missing/invalid but the refresh token was valid —
 * callers should issue new cookies (see getAuthUser).
 */
export async function resolveAuthFromCookieValues(
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<{ user: JWTPayload | null; rotated: boolean }> {
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      return { user: payload, rotated: false };
    }
  }

  if (!refreshToken) {
    return { user: null, rotated: false };
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return { user: null, rotated: false };
  }

  return { user: payload, rotated: true };
}

export async function setAuthCookies(payload: JWTPayload) {
  const accessToken = await signAccessToken(payload);
  const refreshToken = await signRefreshToken(payload);
  const cookieStore = await cookies();

  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE_SEC,
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  const { user, rotated } = await resolveAuthFromCookieValues(accessToken, refreshToken);
  if (user && rotated) {
    await setAuthCookies(user);
  }
  return user;
}

export function generateVerificationToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
