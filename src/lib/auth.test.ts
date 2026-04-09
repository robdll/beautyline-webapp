import { describe, it, expect } from 'vitest';
import { SignJWT } from 'jose';
import {
  resolveAuthFromCookieValues,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  type JWTPayload,
} from './auth';

const sampleUser: JWTPayload = {
  userId: '507f1f77bcf86cd799439011',
  email: 'admin@example.com',
  role: 'admin',
};

describe('resolveAuthFromCookieValues (refresh behavior)', () => {
  it('accepts a valid access token and does not mark rotation', async () => {
    const access = await signAccessToken(sampleUser);
    const refresh = await signRefreshToken(sampleUser);
    const { user, rotated } = await resolveAuthFromCookieValues(access, refresh);
    expect(rotated).toBe(false);
    expect(user).toMatchObject({
      userId: sampleUser.userId,
      email: sampleUser.email,
      role: sampleUser.role,
    });
  });

  it('uses refresh when access is expired and marks rotation', async () => {
    const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const expiredAccess = await new SignJWT({ ...sampleUser })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) - 120)
      .sign(accessSecret);

    expect(await verifyAccessToken(expiredAccess)).toBeNull();

    const refresh = await signRefreshToken(sampleUser);
    const { user, rotated } = await resolveAuthFromCookieValues(expiredAccess, refresh);

    expect(rotated).toBe(true);
    expect(user).toMatchObject({
      userId: sampleUser.userId,
      email: sampleUser.email,
      role: sampleUser.role,
    });
  });

  it('uses refresh when access is missing', async () => {
    const refresh = await signRefreshToken(sampleUser);
    const { user, rotated } = await resolveAuthFromCookieValues(undefined, refresh);
    expect(rotated).toBe(true);
    expect(user?.email).toBe(sampleUser.email);
  });

  it('returns null when access is invalid and refresh is missing', async () => {
    const { user, rotated } = await resolveAuthFromCookieValues('not-a-jwt', undefined);
    expect(user).toBeNull();
    expect(rotated).toBe(false);
  });

  it('returns null when access is missing and refresh is expired', async () => {
    const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);
    const expiredRefresh = await new SignJWT({ ...sampleUser })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) - 120)
      .sign(refreshSecret);

    expect(await verifyRefreshToken(expiredRefresh)).toBeNull();

    const { user, rotated } = await resolveAuthFromCookieValues(undefined, expiredRefresh);
    expect(user).toBeNull();
    expect(rotated).toBe(false);
  });
});

describe('token round-trips', () => {
  it('signs and verifies access token', async () => {
    const token = await signAccessToken(sampleUser);
    const payload = await verifyAccessToken(token);
    expect(payload).toMatchObject(sampleUser);
  });

  it('signs and verifies refresh token', async () => {
    const token = await signRefreshToken(sampleUser);
    const payload = await verifyRefreshToken(token);
    expect(payload).toMatchObject(sampleUser);
  });
});
