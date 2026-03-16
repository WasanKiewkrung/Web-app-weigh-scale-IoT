import { useEffect, useState } from 'react'

export function useLatestVersion() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const res = await fetch('/version.txt')
        const text = await res.text()
        setLatestVersion(text.trim())
      } catch (err) {
        console.error('Failed to load version.txt', err)
        setLatestVersion(null)
      }
    }
    fetchLatestVersion()
  }, [])

  return latestVersion
}
