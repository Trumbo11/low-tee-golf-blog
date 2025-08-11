import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react'
import { getPostBySlug } from '../data/blogPosts'
import { isCmsEnabled, fetchPostBySlugFromCms } from '../services/cms'
import './BlogPost.css'

const BlogPost = () => {
  const { slug } = useParams()
  const [remotePost, setRemotePost] = useState(null)
  const [remoteError, setRemoteError] = useState(null)

  useEffect(() => {
    let isActive = true
    const run = async () => {
      if (!isCmsEnabled()) {
        setRemotePost(null)
        return
      }
      try {
        const p = await fetchPostBySlugFromCms(slug)
        if (isActive) setRemotePost(p)
      } catch (err) {
        if (isActive) setRemoteError(err)
      }
    }
    run()
    return () => { isActive = false }
  }, [slug])

  const post = useMemo(() => {
    return (remotePost && !remoteError) ? remotePost : getPostBySlug(slug)
  }, [remotePost, remoteError, slug])

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  // Convert markdown-style content to JSX (basic implementation)
  const formatContent = (content) => {
    const lines = content.trim().split('\n')
    const elements = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i}>{line.substring(2)}</h1>)
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i}>{line.substring(3)}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i}>{line.substring(4)}</h3>)
      } else if (line.startsWith('#### ')) {
        elements.push(<h4 key={i}>{line.substring(5)}</h4>)
      } else if (line.startsWith('- ')) {
        // Handle list items
        const listItems = []
        let j = i
        while (j < lines.length && lines[j].startsWith('- ')) {
          listItems.push(<li key={j}>{lines[j].substring(2)}</li>)
          j++
        }
        elements.push(<ul key={i}>{listItems}</ul>)
        i = j - 1
      } else if (line.trim() === '') {
        // Skip empty lines
        continue
      } else {
        // Regular paragraph
        if (line.trim()) {
          elements.push(<p key={i}>{line}</p>)
        }
      }
    }
    
    return elements
  }

  return (
    <div className="blog-post-page">
      <div className="container">
        <Link to="/blog" className="back-link">
          <ArrowLeft size={20} />
          Back to Blog
        </Link>
        
        <article className="blog-post">
          <header className="post-header">
            <img 
              src={post.image} 
              alt={post.title}
              className="post-image"
            />
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
            {formatContent(post.content)}
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
