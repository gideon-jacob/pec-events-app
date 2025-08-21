// Lightweight AsyncStorage-backed cache with TTL

const CACHE_PREFIX = 'apiCache:v1:'

let storage: any | null = null

async function getStorage() {
  if (storage) return storage
  try {
    storage = (await import('@react-native-async-storage/async-storage')).default
  } catch (e) {
    // Fallback shim for environments without AsyncStorage (should not happen in Expo app)
    const mem = new Map<string, string>()
    storage = {
      async getItem(key: string) {
        return mem.get(key) ?? null
      },
      async setItem(key: string, value: string) {
        mem.set(key, value)
      },
      async removeItem(key: string) {
        mem.delete(key)
      },
      async getAllKeys() {
        return Array.from(mem.keys())
      },
      async multiRemove(keys: string[]) {
        keys.forEach((k) => mem.delete(k))
      },
    }
  }
  return storage
}

type CacheRecord<T> = {
  ts: number
  data: T
}

export async function getCached<T>(key: string, ttlMs: number): Promise<T | null> {
  const store = await getStorage()
  try {
    const raw = await store.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const parsed: CacheRecord<T> = JSON.parse(raw)
    if (!parsed || typeof parsed.ts !== 'number') return null
    const isExpired = Date.now() - parsed.ts > ttlMs
    if (isExpired) return null
    return parsed.data
  } catch {
    return null
  }
}

export async function setCached<T>(key: string, data: T): Promise<void> {
  const store = await getStorage()
  const record: CacheRecord<T> = { ts: Date.now(), data }
  try {
    await store.setItem(CACHE_PREFIX + key, JSON.stringify(record))
  } catch {
    // ignore persistence errors
  }
}

export async function withCache<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = await getCached<T>(key, ttlMs)
  if (cached !== null) return cached
  const fresh = await fetcher()
  await setCached(key, fresh)
  return fresh
}

export async function invalidateCacheKeys(keys: string[]): Promise<void> {
  const store = await getStorage()
  try {
    await store.multiRemove(keys.map((k) => CACHE_PREFIX + k))
  } catch {
    // ignore
  }
}

export async function invalidateCacheByPrefix(prefix: string): Promise<void> {
  const store = await getStorage()
  try {
    const keys: string[] = await store.getAllKeys()
    const toRemove = keys.filter((k) => k.startsWith(CACHE_PREFIX + prefix))
    if (toRemove.length) await store.multiRemove(toRemove)
  } catch {
    // ignore
  }
}

export const TWENTY_HOURS_MS = 20 * 60 * 60 * 1000


