import { connectDB } from '@/lib/mongodb';
import RateLimit from '@/models/RateLimit';

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowSec: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec?: number;
}

export async function checkRateLimit({
  key,
  limit,
  windowSec,
}: RateLimitOptions): Promise<RateLimitResult> {
  await connectDB();

  const now = Date.now();
  const expiresAt = new Date(now + windowSec * 1000);

  const existing = await RateLimit.findOne({ key });

  if (!existing || existing.expiresAt.getTime() <= now) {
    await RateLimit.findOneAndUpdate(
      { key },
      { $set: { count: 1, expiresAt } },
      { upsert: true }
    );
    return { allowed: true };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.expiresAt.getTime() - now) / 1000)),
    };
  }

  await RateLimit.updateOne({ key }, { $inc: { count: 1 } });
  return { allowed: true };
}

export async function enforceRateLimits(
  checks: RateLimitOptions[]
): Promise<RateLimitResult> {
  for (const check of checks) {
    const result = await checkRateLimit(check);
    if (!result.allowed) {
      return result;
    }
  }
  return { allowed: true };
}
