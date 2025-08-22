import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')

// Web Push config
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

// Simple in-memory store for subscriptions (replace with DB table if needed)
const pushSubscriptions = new Map()

app.get('/api/health', (req, res) => res.json({ ok: true }))

// Assets sample endpoint
app.get('/api/assets', async (req, res) => {
  // Expecting a Supabase table: assets_master
  try {
    const { data, error } = await supabase.from('assets_master').select('id, asset_code, asset_name, location').limit(100)
    if (error) throw error
    res.json(data || [])
  } catch (e) {
    res.status(500).json([])
  }
})

// Breakdown creation (with minimal shape)
app.post('/api/breakdowns', async (req, res) => {
  const payload = req.body || {}
  try {
    const { data, error } = await supabase.from('breakdown_logs').insert({
      asset_id: payload.asset_id || null,
      description: payload.description || '',
      status: 'OPEN'
    }).select('*').single()
    if (error) throw error
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'failed' })
  }
})

// Push subscription endpoints
app.post('/api/push/subscribe', (req, res) => {
  const { endpoint } = req.body || {}
  if (!endpoint) return res.status(400).json({ error: 'missing endpoint' })
  pushSubscriptions.set(endpoint, req.body)
  res.json({ ok: true })
})

app.post('/api/push/send', async (req, res) => {
  const { title = 'MIS', body = 'Update', data = {} } = req.body || {}
  const payload = JSON.stringify({ title, body, data })
  const results = []
  for (const sub of pushSubscriptions.values()) {
    try {
      await webpush.sendNotification(sub, payload)
      results.push({ ok: true })
    } catch (e) {
      results.push({ ok: false })
    }
  }
  res.json({ sent: results.length })
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})


