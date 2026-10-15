interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * In-memory sliding token bucket rate limiter
 * Protects endpoints from DDoS and API key budget exhaustion
 */
export async function checkRateLimit(
  identifier: string,
  limit = 20,
  windowSeconds = 60
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const key = `ratelimit:${identifier}`;

  let record = memoryStore.get(key);

  if (!record) {
    record = {
      tokens: limit,
      lastRefill: now,
    };
    memoryStore.set(key, record);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - record.lastRefill;
  if (elapsed > windowMs) {
    record.tokens = limit;
    record.lastRefill = now;
  }

  if (record.tokens > 0) {
    record.tokens -= 1;
    return {
      success: true,
      limit,
      remaining: record.tokens,
      reset: Math.ceil((record.lastRefill + windowMs - now) / 1000),
    };
  }

  return {
    success: false,
    limit,
    remaining: 0,
    reset: Math.ceil((record.lastRefill + windowMs - now) / 1000),
  };
}
