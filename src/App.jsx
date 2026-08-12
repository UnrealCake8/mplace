import Editor, { FullPreview } from './Editor'
import PublicPlace from './PublicPlace'

export default function App() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '')
  if (path === 'editor') return <Editor />
  if (path === 'preview') return <FullPreview />
  if (path && !path.includes('/')) return <PublicPlace username={path} />
  return <main className="status-page"><h1>MPlace</h1><p>Create your place at <a href="/editor">the editor</a>.</p></main>
}
