exports.handler = async (event) => {
  try {
    const CMS_URL = process.env.CMS_URL
    const CMS_TOKEN = process.env.CMS_TOKEN

    if (!CMS_URL || !CMS_TOKEN) {
      return { statusCode: 500, body: 'CMS configuration missing' }
    }

    const { path } = event
    const slug = path.split('/').pop()

    const upstream = `${CMS_URL.replace(/\/$/, '')}/api/posts/${encodeURIComponent(slug)}`

    const res = await fetch(upstream, {
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
