import { useState } from 'react'
import PlaceFrame from './PlaceFrame'

const initial = { html: '<main><h1>My Place</h1><p>Make yourself at home.</p></main>', css: 'body { font-family: sans-serif; padding: 3rem; }', javascript: '' }

export default function Editor() {
  const [place, setPlace] = useState(initial)
  const [username, setUsername] = useState('hammad')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const change = field => event => setPlace(current => ({ ...current, [field]: event.target.value }))
  const publish = async () => {
    setMessage('Publishing…')
    const response = await fetch(`/api/editor/places/${encodeURIComponent(username)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...place, published: true }) })
    setMessage(response.ok ? `Published at /${username}` : 'Publishing failed.')
  }
  const fullPreview = () => {
    sessionStorage.setItem('mplace-preview', JSON.stringify(place))
    window.open('/preview', '_blank', 'noopener')
  }
  return <main className="editor">
    <section className="controls">
      <h1>MPlace editor</h1>
      <label>Username<input value={username} onChange={event => setUsername(event.target.value)} /></label>
      <label>Editor token<input type="password" autoComplete="current-password" value={token} onChange={event => setToken(event.target.value)} /></label>
      <label>HTML<textarea value={place.html} onChange={change('html')} /></label>
      <label>CSS<textarea value={place.css} onChange={change('css')} /></label>
      <label>JavaScript<textarea value={place.javascript} onChange={change('javascript')} /></label>
      <div className="actions"><button onClick={publish}>Publish</button><button className="secondary" onClick={fullPreview}>Open Full Preview</button></div>
      <p aria-live="polite">{message}</p>
    </section>
    <section className="preview"><PlaceFrame place={place} title="Editor preview" /></section>
  </main>
}

export function FullPreview() {
  let place = initial
  try { place = JSON.parse(sessionStorage.getItem('mplace-preview')) || initial } catch { /* use starter */ }
  return <PlaceFrame place={place} title="Full Place preview" />
}
