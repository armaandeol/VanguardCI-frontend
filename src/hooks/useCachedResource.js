import { useCallback, useEffect, useRef, useState } from 'react'

// Module-level store so data survives a component unmount/remount
// (e.g. navigating away and back), avoiding empty/loading flashes.
const cache = new Map()

// Fetches `fetcher()` under `key` in the background. Renders cached data
// immediately if present, and only triggers a re-render when the fresh
// response actually differs from what's cached.
export function useCachedResource(key, fetcher) {
  const [data, setData] = useState(() => (cache.has(key) ? cache.get(key) : null))
  const [error, setError] = useState(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    setData(cache.has(key) ? cache.get(key) : null)
    setError(null)
  }, [key])

  const load = useCallback(() => {
    let cancelled = false

    fetcherRef.current()
      .then((result) => {
        if (cancelled) return
        const previous = cache.get(key)
        if (JSON.stringify(previous) !== JSON.stringify(result)) {
          cache.set(key, result)
          setData(result)
        }
        setError(null)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [key])

  useEffect(() => load(), [load])

  return { data, error, refetch: load }
}
