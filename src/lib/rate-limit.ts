/**
 * In-memory sliding window rate limiter.
 *
 * Uses a Map of keys → { count, resetAt } to track request counts
 * within a sliding time window. Expired entries are cleaned up
 * periodically to prevent memory leaks.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup expired entries every 60 seconds
let cleanupTimer: ReturnType<typeof setInterval> | null = null

function startCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) {
        store.delete(key)
      }
    }
  }, 60_000)

  // Prevent the timer from keeping the process alive
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref()
  }
}

startCleanup()

/**
 * Rate limit check using a fixed-window algorithm.
 *
 * @param key     Identifier for the client (typically IP address)
 * @param limit   Maximum number of requests allowed in the window
 * @param windowMs  Window duration in milliseconds
 * @returns       Object with `success` (true if under limit),
 *                `remaining` (requests left), and `resetAt` (timestamp when window resets)
 */
export function rateLimit(
  key: string,
  limit: number = 30,
  windowMs: number = 60_000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()

  let entry = store.get(key)

  // If no entry exists or the window has expired, start a fresh window
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs }
    store.set(key, entry)
  }

  entry.count++

  const remaining = Math.max(0, limit - entry.count)
  const success = entry.count <= limit

  return { success, remaining, resetAt: entry.resetAt }
}
