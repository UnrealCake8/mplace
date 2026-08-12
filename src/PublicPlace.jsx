import { useEffect, useState } from 'react'
import PlaceFrame from './PlaceFrame'

export default function PublicPlace({ username }) {
  const [state, setState] = useState({ loading: true })
  useEffect(() => {
    const controller = new AbortController()
    setState({ loading: true })
    fetch(`/api/places/${encodeURIComponent(username)}`, { signal: controller.signal })
      .then(async response => {
        const body = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(body.message || "This Place couldn't be loaded.")
        return body
      })
      .then(place => setState({ place }))
      .catch(error => error.name !== 'AbortError' && setState({ error: error.message }))
    return () => controller.abort()
  }, [username])
  if (state.loading) return <main className="status-page" role="status">Loading Place…</main>
  if (state.error) return <main className="status-page"><h1>{state.error}</h1><p>Check the address or try again later.</p></main>
  return <PlaceFrame place={state.place} title={`${username}'s Place`} />
}
