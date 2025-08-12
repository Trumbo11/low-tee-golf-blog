import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, User, ArrowRight } from 'lucide-react'
import './BlogCard.css'

const BlogCard = ({ post }) => {
  const navigate = useNavigate()
  const slug = String(post?.slug || '').trim()
  const to = slug ? `/blog/${encodeURIComponent(slug)}` : undefined

  const handleCardClick = () => {
    if (to) navigate(to)
  }

  // Normalize image: allow relative '/uploads/..' from CMS
  const imgSrc = (post.image || '').startsWith('http') || (post.image || '').startsWith('/')
    ? post.image
    : ''

  return (
    <article className="blog-card card" onClick={handleCardClick} style={{ cursor: to ? 'pointer' : 'default' }}>
      {imgSrc && (
      <img 
        src={imgSrc} 
        alt={post.title}
        className="card-image"
      />
      )}
      <div className="card-content">
        <div className="card-meta">
          <div className='meta-top-items-wrapper'>
            <span className="meta-item">
            <Calendar size={14} />
            {new Date(post.date).toLocaleDateString()}
          </span>
          <span className="meta-item">
            <User size={14} />
            {post.author}
          </span>
          </div>
          <div className="category-tag">{post.category}</div>
        </div>
        <h3 className="card-title">
          {to ? <Link to={to}>{post.title}</Link> : post.title}
        </h3>
        <p className="card-excerpt">{post.excerpt}</p>
        {to && (
          <Link to={to} className="read-more">
            Read More
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </article>
  )
}

export default BlogCard
