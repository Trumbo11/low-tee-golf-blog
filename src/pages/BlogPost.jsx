import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react'
import { getPostBySlug } from '../data/blogPosts'
import { fetchPostBySlugFromCms } from '../services/cms'
import './BlogPost.css'
import DOMPurify from 'dompurify'

const BlogPost = () => {
  const { slug } = useParams()
  const [remotePost, setRemotePost] = useState(null)
  const [remoteError, setRemoteError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true
    const run = async () => {
      setIsLoading(true)
      try {
        const p = await fetchPostBySlugFromCms(slug)
        if (isActive) setRemotePost(p)
      } catch (err) {
        if (isActive) setRemoteError(err)
      } finally {
        if (isActive) setIsLoading(false)
      }
    }
    run()
    return () => { isActive = false }
  }, [slug])

  const post = useMemo(() => {
    return (remotePost && !remoteError) ? remotePost : getPostBySlug(slug)
  }, [remotePost, remoteError, slug])

  // While loading and no local fallback exists, show nothing (or a simple loading state)
  if (!post && isLoading) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <div className="post-loading">Loading…</div>
        </div>
      </div>
    )
  }

  if (!post && !isLoading) {
    return <Navigate to="/blog" replace />
  }

  // Render HTML content safely
  const renderHtml = (html) => {
    const clean = DOMPurify.sanitize(html || '', { USE_PROFILES: { html: true } })
    return <div dangerouslySetInnerHTML={{ __html: clean }} />
  }

  // Normalize image: allow relative '/uploads/..' from CMS
  const imgSrc = (post.image || '').startsWith('http') || (post.image || '').startsWith('/')
    ? post.image
    : ''

  return (
    <div className="blog-post-page">
      <div className="container">
        <Link to="/blog" className="back-link">
          <ArrowLeft size={20} />
          Back to Blog
        </Link>
        
        <article className="blog-post">
          <header className="post-header">
            {imgSrc && (
            <img 
              src={imgSrc} 
              alt={post.title}
              className="post-image"
            />)}
            <div className="post-meta">
              <span className="meta-item">
                <Calendar size={16} />
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="meta-item">
                <User size={16} />
                {post.author}
              </span>
              <span className="meta-item">
                <Tag size={16} />
                {post.category}
              </span>
            </div>
            <h1 className="post-title">{post.title}</h1>
          </header>
          
          <div className="post-content">
            {renderHtml(post.content)}
          </div>
        </article>

        <div className="post-footer">
          <div className="share-section">
            <h3>Share this post</h3>
            <div className="share-buttons">
              <button className="share-btn">Twitter</button>
              <button className="share-btn">Facebook</button>
              <button className="share-btn">LinkedIn</button>
            </div>
          </div>
          
          <div className="navigation-section">
            <Link to="/blog" className="btn btn-secondary">
              View All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
