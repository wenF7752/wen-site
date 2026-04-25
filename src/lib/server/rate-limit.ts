// In-memory bucketed rate limiter.
// Best-effort on serverless: state does not survive cold starts and does not
// shard across instances. Treat as defense-in-depth, not enforcement.

const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkRate(
	bucket: string,
	ip: string,
	limit: number,
	windowMs: number
): boolean {
	const key = `${bucket}:${ip}`
	const now = Date.now()
	const entry = buckets.get(key)

	if (!entry || now > entry.resetAt) {
		buckets.set(key, { count: 1, resetAt: now + windowMs })
		return true
	}

	if (entry.count >= limit) {
		return false
	}

	entry.count++
	return true
}
