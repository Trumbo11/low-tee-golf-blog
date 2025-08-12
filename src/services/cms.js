// Lightweight CMS client with graceful fallback support.
// If VITE_CMS_URL is defined, functions will attempt to fetch from a Strapi-like API.

// In private-read mode, we hit our own Netlify Functions under /api/*
// Toggle on via VITE_USE_CMS=true (or supply a direct VITE_CMS_URL if you bypass functions).
// Development note: React 18 StrictMode double-invokes effects. We dedupe in-flight
// GET requests below so you won't see duplicate network calls in dev.

// Simple in-memory cache for in-flight requests (5s TTL)
const INFLIGHT_TTL_MS = 5000
const inflight = {
  lists: new Map(), // key: query string, value: { promise, ts }
  posts: new Map(), // key: slug, value: { promise, ts }
}

const getDedupe = (map, key, fetcher) => {
  const now = Date.now()
  const existing = map.get(key)
  if (existing && now - existing.ts < INFLIGHT_TTL_MS) {
    return existing.promise
  }
  const promise = (async () => {
    try {
      return await fetcher()
    } finally {
      // leave entry for TTL window; it will be replaced on next call
    }
  })()
  map.set(key, { promise, ts: now })
  return promise
}
const getCmsBaseUrl = () => {
  const proxyBase = '/api'
  const direct = String(import.meta?.env?.VITE_CMS_URL || '').trim()
  // If a direct URL is provided, normalize to include '/api' suffix for Strapi-like/CMS server
  if (direct) {
    const normalized = direct.replace(/\/$/, '')
    if (/\/api$/i.test(normalized)) return normalized
    return `${normalized}/api`
  }
  return proxyBase
}

export const isCmsEnabled = () => {
  return String(import.meta?.env?.VITE_USE_CMS || '').toLowerCase() === 'true'
}

const getAuthHeaders = () => {
  const maybeToken = String(import.meta?.env?.VITE_CMS_TOKEN || '').trim()
  if (!maybeToken) return {}
  return { Authorization: `Bearer ${maybeToken}` }
}

// Normalize upstream post (supports Strapi-like or flat custom shape)
const normalizePost = (item) => {
  if (!item) return null
  // Strapi-like
  if (item.attributes) {
    const id = item.id
    const attrs = item.attributes || {}
    const category = attrs.category?.data?.attributes?.name || attrs.category?.name || attrs.category || ''
    const imageUrl =
      attrs.image?.data?.attributes?.url ||
      attrs.coverImage?.data?.attributes?.url ||
      attrs.imageUrl ||
      ''
    const resolvedImage = imageUrl && imageUrl.startsWith('http') ? imageUrl : imageUrl
    return {
      id,
      title: attrs.title || '',
      slug: attrs.slug || String(id),
      excerpt: attrs.excerpt || '',
      content: attrs.content || '',
      author: attrs.author || '',
      date: attrs.date || attrs.publishedAt || attrs.createdAt || new Date().toISOString(),
      category,
      image: resolvedImage,
      featured: Boolean(attrs.featured),
    }
  }
  // Flat custom shape already matches our app
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content,
    author: item.author,
    date: item.date,
    category: item.category,
    image: item.image || item.imageUrl || '',
    featured: Boolean(item.featured),
  }
}

const buildQueryString = (params) => {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    usp.append(key, value)
  })
  return usp.toString()
}

export const fetchPostsFromCms = async ({ category, featured } = {}) => {
  const base = getCmsBaseUrl()
  if (!base) return null

  const queryParams = {}
  if (category) queryParams['category'] = category
  if (featured !== undefined) queryParams['featured'] = String(Boolean(featured))
  // Only published posts on client
  queryParams['all'] = ''

  const qs = buildQueryString(queryParams)
  const url = `${base}/posts?${qs}`
  return getDedupe(inflight.lists, qs || '_all', async () => {
    const res = await fetch(url, { headers: { ...getAuthHeaders() } })
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`)
    const data = await res.json()
    const items = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    return items.map(normalizePost)
  })
}

export const fetchPostBySlugFromCms = async (slug) => {
  const base = getCmsBaseUrl()
  if (!base) return null
  const key = String(slug || '') || '_'
  return getDedupe(inflight.posts, key, async () => {
    const isProxyBase = base.startsWith('/') // '/api' means proxy/functions path
    const segment = isProxyBase ? 'post' : 'posts'
    const res = await fetch(`${base}/${segment}/${encodeURIComponent(slug)}`, {
      headers: {
        ...getAuthHeaders(),
      },
    })
    if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`)
    const data = await res.json()
    const item = data?.data ?? data
    return normalizePost(item)
  })
}
