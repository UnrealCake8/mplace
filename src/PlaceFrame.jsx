import { useState } from 'react'
import { renderDocument } from './document'

export default function PlaceFrame({ place, title = 'Place preview' }) {
  const [ready, setReady] = useState(false)
  return <div className="frame-host">
    {!ready && <div className="place-loading" role="status">Loading Place…</div>}
    <iframe
      className="place-frame"
      title={title}
      sandbox="allow-scripts"
      srcDoc={renderDocument(place)}
      onLoad={() => setReady(true)}
    />
  </div>
}
