import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import { blogPosts } from '../data/blogPosts'
import { isCmsEnabled, fetchPostsFromCms } from '../services/cms'
import './Blog.css'

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [remotePosts, setRemotePosts] = useState(null)
  const [remoteError, setRemoteError] = useState(null)

  // Read the category directly from the URL every render
  const selectedCategory = searchParams.get('category') || ''

  // Fetch from CMS if configured; gracefully fall back to local data
  useEffect(() => {
    let isActive = true
    const run = async () => {
      if (!isCmsEnabled()) {
        setRemotePosts(null)
        return
      }
      try {
        const posts = await fetchPostsFromCms()
        if (isActive) setRemotePosts(posts)
      } catch (err) {
        if (isActive) setRemoteError(err)
      }
    }
    run()
    return () => { isActive = false }
  }, [])

  const effectivePosts = useMemo(() => {
    const source = remotePosts && !remoteError ? remotePosts : blogPosts
    if (!selectedCategory) return source
    return source.filter(p => (p.category || '').toLowerCase() === selectedCategory.toLowerCase())
  }, [remotePosts, remoteError, selectedCategory])

  const categories = useMemo(() => {
    const source = remotePosts && !remoteError ? remotePosts : blogPosts
    return Array.from(new Set(source.map(p => p.category).filter(Boolean)))
  }, [remotePosts, remoteError])

  // Helper that MERGES params (preserves utm and others)
  const setCategory = (category) => {
    const next = new URLSearchParams(searchParams)
    if (category) {
      next.set('category', category)
    } else {
      next.delete('category')
    }
    setSearchParams(next) // no replace -> pushes history; use { replace:true } if you prefer
  }

  return (
    <div className="blog-page">
      <div className="container">
        <header className="blog-header">
          <h1>Golf Blog</h1>
          <p>Expert tips, course reviews, equipment guides, and the latest golf news</p>
        </header>

        <div className="blog-filters">
          <button
            className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setCategory('')}
          >
            All Posts
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="blog-grid">
          {effectivePosts.length > 0 ? (
            effectivePosts.map((post) => <BlogCard key={post.id} post={post} />)
          ) : (
            <div className="no-posts">
              <h3>No posts found</h3>
              <p>Try selecting a different category or check back later for new content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog
