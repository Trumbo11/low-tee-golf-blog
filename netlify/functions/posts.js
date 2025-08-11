exports.handler = async (event) => {
  try {
    const CMS_URL = process.env.CMS_URL
    const CMS_TOKEN = process.env.CMS_TOKEN

    if (!CMS_URL || !CMS_TOKEN) {
      return { statusCode: 500, body: 'CMS configuration missing' }
    }

    const url = new URL(event.rawUrl || 'http://localhost')
    const params = new URLSearchParams(url.search)

    const upstream = new URL(`${CMS_URL.replace(/\/$/, '')}/api/posts`)
    // forward selected filters (category, featured)
    if (params.get('category')) upstream.searchParams.set('category', params.get('category'))
    if (params.get('featured')) upstream.searchParams.set('featured', params.get('featured'))

    const res = await fetch(upstream.toString(), {
      headers: {
        Authorization: `Bearer ${CMS_TOKEN}`,
      },
    })

    if (!res.ok) {
      return { statusCode: res.status, body: 'Upstream error' }
    }

    const data = await res.json()

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=60, s-maxage=600',
      },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: 'Server error' }
  }
}
