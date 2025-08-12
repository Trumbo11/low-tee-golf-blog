import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const app = express()
const prisma = new PrismaClient()

const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const CORS_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
// Support hostname wildcard patterns like "*.netlify.app" or exact hostnames like "localhost"
const CORS_ORIGIN_PATTERNS = (process.env.CORS_ORIGIN_PATTERNS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
const SERVICE_TOKEN = process.env.SERVICE_TOKEN || null

app.use(express.json({ limit: '1mb' }))

const isOriginAllowed = (origin) => {
  if (!origin) return true
  if (CORS_ORIGINS.length === 0 && CORS_ORIGIN_PATTERNS.length === 0) return true
  if (CORS_ORIGINS.includes(origin)) return true
  try {
    const url = new URL(origin)
    const { hostname, port, protocol } = url
    // Always allow same-origin access to this server (e.g., admin UI served from the same host)
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && String(port || (protocol === 'https:' ? '443' : '80')) === String(PORT)) {
      return true
    }
    // Exact hostname matches (e.g., "localhost")
    if (CORS_ORIGINS.includes(hostname)) return true
    // Wildcard hostname patterns (e.g., "*.netlify.app")
    for (const pattern of CORS_ORIGIN_PATTERNS) {
      if (!pattern) continue
      // Normalize pattern
      const trimmed = pattern.trim()
      if (trimmed.startsWith('*.')) {
        const suffix = trimmed.slice(2)
        if (hostname === suffix || hostname.endsWith(`.${suffix}`)) {
          return true
        }
      } else if (hostname === trimmed) {
        return true
      }
    }
  } catch {
    // If origin is not a valid URL, deny by default
  }
  return false
}

app.use(cors({
  origin: (origin, cb) => {
    if (isOriginAllowed(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use('/admin', express.static('public', { index: 'admin.html' }))
app.use('/uploads', express.static('uploads'))

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext)
    const safe = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    cb(null, `${safe}-${Date.now()}${ext}`)
  }
})
const upload = multer({ storage })

// Simple admin auth (token issuance) — for admin UI use only
app.post('/api/auth/token', async (req, res) => {
  const bodySchema = z.object({ username: z.string(), password: z.string() })
  const parse = bodySchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: 'Invalid body' })
  // Replace with real user lookup & hash verification
  if (parse.data.username !== 'admin' || parse.data.password !== 'admin') {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ sub: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' })
  res.json({ token })
})

// Bearer token middleware for private reads
const requireBearer = (req, res, next) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })
  try {
    // Allow either signed JWT or static service token
    if (SERVICE_TOKEN && token === SERVICE_TOKEN) {
      return next()
    }
    jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Public health check
app.get('/health', (_req, res) => res.json({ ok: true }))

// Private read endpoints consumed by Netlify Functions
app.get('/api/posts', requireBearer, async (req, res) => {
  try {
    const { category, featured, all } = req.query
    const where = {}
    if (category) where.category = { name: { equals: String(category) } }
    if (featured !== undefined) where.featured = String(featured).toLowerCase() === 'true'
    if (!all) {
      // Only published (non-draft) and not in the future for public consumption
      where.draft = false
      where.date = { lte: new Date() }
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { category: true },
    })

    res.json(posts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      date: p.date.toISOString(),
      image: p.image || '',
      featured: p.featured,
      draft: p.draft,
      category: p.category.name,
    })))
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/posts/:slug', requireBearer, async (req, res) => {
  try {
    const { slug } = req.params
    const { all } = req.query
    const p = await prisma.post.findUnique({
      where: { slug },
      include: { category: true },
    })
    if (!p) return res.status(404).json({ error: 'Not found' })
    if (!all) {
      if (p.draft || p.date > new Date()) {
        return res.status(404).json({ error: 'Not found' })
      }
    }
    res.json({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      date: p.date.toISOString(),
      image: p.image || '',
      featured: p.featured,
      draft: p.draft,
      category: p.category.name,
    })
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Categories
app.get('/api/categories', requireBearer, async (_req, res) => {
  try {
    const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    res.json(cats)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/categories', requireBearer, async (req, res) => {
  try {
    const schema = z.object({ name: z.string().min(1), slug: z.string().min(1) })
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' })
    const cat = await prisma.category.create({ data: parsed.data })
    res.status(201).json(cat)
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Category name or slug already exists' })
    console.error('POST /api/categories error:', e)
    res.status(500).json({ error: 'Server error' })
  }
})

// Posts CRUD for admin
app.post('/api/posts', requireBearer, async (req, res) => {
  try {
    const ImageSchema = z.union([z.string().url(), z.string().regex(/^\/uploads\//)]).optional().nullable()
    const schema = z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      excerpt: z.string().min(1),
      content: z.string().min(1),
      author: z.string().min(1),
      date: z.coerce.date().optional(),
      image: ImageSchema,
      featured: z.coerce.boolean().optional(),
      draft: z.coerce.boolean().optional(),
      categorySlug: z.string().min(1),
    })
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' })
    const category = await prisma.category.findUnique({ where: { slug: parsed.data.categorySlug } })
    if (!category) return res.status(400).json({ error: 'Category not found' })
    const created = await prisma.post.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        author: parsed.data.author,
        date: parsed.data.date || new Date(),
        image: parsed.data.image || null,
        featured: Boolean(parsed.data.featured),
        draft: Boolean(parsed.data.draft),
        categoryId: category.id,
      }
    })
    res.status(201).json(created)
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Slug already exists' })
    console.error('POST /api/posts error:', e)
    res.status(500).json({ error: 'Server error' })
  }
})

// Media library
app.get('/api/media', requireBearer, async (_req, res) => {
  try {
    const items = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/media', requireBearer, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Missing file' })
    const publicUrl = `/uploads/${req.file.filename}`
    const created = await prisma.media.create({ data: { filename: req.file.originalname, url: publicUrl } })
    res.status(201).json(created)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.delete('/api/media/:id', requireBearer, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
    const item = await prisma.media.delete({ where: { id } })
    // Best-effort unlink
    const filePath = path.join(uploadsDir, path.basename(item.url))
    fs.promises.unlink(filePath).catch(() => {})
    res.status(204).send()
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Not found' })
    res.status(500).json({ error: 'Server error' })
  }
})

app.put('/api/posts/:id', requireBearer, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
    const ImageSchema = z.union([z.string().url(), z.string().regex(/^\/uploads\//)]).optional().nullable()
    const schema = z.object({
      title: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      excerpt: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      date: z.coerce.date().optional(),
      image: ImageSchema,
      featured: z.coerce.boolean().optional(),
      draft: z.coerce.boolean().optional(),
      categorySlug: z.string().min(1).optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' })
    const data = { ...parsed.data }
    if (data.categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } })
      if (!category) return res.status(400).json({ error: 'Category not found' })
      data.categoryId = category.id
      delete data.categorySlug
    }
    const updated = await prisma.post.update({ where: { id }, data })
    res.json(updated)
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Not found' })
    if (e.code === 'P2002') return res.status(409).json({ error: 'Slug already exists' })
    console.error('PUT /api/posts/:id error:', e)
    res.status(500).json({ error: 'Server error' })
  }
})

// Unpublish (set draft=true) convenience endpoint
app.post('/api/posts/:id/unpublish', requireBearer, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
    const updated = await prisma.post.update({ where: { id }, data: { draft: true } })
    res.json(updated)
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Not found' })
    res.status(500).json({ error: 'Server error' })
  }
})

app.delete('/api/posts/:id', requireBearer, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
    await prisma.post.delete({ where: { id } })
    res.status(204).send()
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Not found' })
    console.error('DELETE /api/posts/:id error:', e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.listen(PORT, () => {
  console.log(`CMS listening on :${PORT}`)
})
