const rateLimitWindowMS = 60 * 1000; // 1 minute
const maxRequests = 10;

type RateLimitRecord = {
  timestamp: number;
  count: number;
};

const ipStore = new Map<string, RateLimitRecord>();

export function rateLimiter(ip: string): boolean {
  const now = Date.now();
  const existing = ipStore.get(ip);

  if (!existing) {
    ipStore.set(ip, { timestamp: now, count: 1 });
    return true;
  }

  if (now - existing.timestamp > rateLimitWindowMS) {
    ipStore.set(ip, { timestamp: now, count: 1 });
    return true;
  }

  if (existing.count < maxRequests) {
    existing.count += 1;
    ipStore.set(ip, existing);
    return true;
  }

  return false;
}
