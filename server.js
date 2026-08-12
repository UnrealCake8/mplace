import express from 'express'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const dataFile = path.join(root, 'data', 'places.json')
const app = express()
app.use(express.json({ limit: '2mb' }))

async function readPlaces() {
  try { return JSON.parse(await readFile(dataFile, 'utf8')) } catch (error) {
    if (error.code === 'ENOENT') return {}
    throw error
  }
}
async function savePlaces(places) {
  await mkdir(path.dirname(dataFile), { recursive: true })
  await writeFile(dataFile, JSON.stringify(places, null, 2))
}

app.get('/api/places/:username', async (req, res) => {
  try {
    const place = (await readPlaces())[req.params.username.toLowerCase()]
    if (!place) return res.status(404).json({ code: 'not_found', message: "This Place doesn't exist." })
    if (!place.published) return res.status(403).json({ code: 'unpublished', message: 'This Place is currently unpublished.' })
    res.json({ username: place.username, html: place.html, css: place.css, javascript: place.javascript })
  } catch { res.status(500).json({ code: 'load_error', message: "This Place couldn't be loaded." }) }
})

function requireEditor(req, res, next) {
  const configuredToken = process.env.MPLACE_EDITOR_TOKEN
  const suppliedToken = req.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!configuredToken || suppliedToken !== configuredToken) return res.status(401).json({ message: 'Authentication required.' })
  next()
}

// Unlike public reads, publishing always requires a server-side credential. The
// credential is held by the trusted editor and is never included in iframe srcdoc.
app.put('/api/editor/places/:username', requireEditor, async (req, res) => {
  const username = req.params.username.toLowerCase()
  if (!/^[a-z0-9_]{2,30}$/.test(username)) return res.status(400).json({ message: 'Invalid username.' })
  const { html = '', css = '', javascript = '', published = false } = req.body
  if (![html, css, javascript].every(value => typeof value === 'string')) return res.status(400).json({ message: 'Invalid Place content.' })
  const places = await readPlaces()
  places[username] = { username, html, css, javascript, published: Boolean(published) }
  await savePlaces(places)
  res.json({ ok: true, url: `/${username}` })
})

const dist = path.join(root, 'dist')
app.use(express.static(dist))
app.get('*path', (_req, res) => res.sendFile(path.join(dist, 'index.html')))

if (process.env.NODE_ENV !== 'test') app.listen(process.env.PORT || 3001)
export default app
