import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight } from 'lucide-react'
import './BlogCard.css'

const BlogCard = ({ post }) => {
  return (
    <article className="blog-card card">
      <img 
        src={post.image} 
        alt={post.title}
        className="card-image"
      />
      <div className="card-content">
        <div className="card-meta">
          <span className="meta-item">
            <Calendar size={14} />
            {new Date(post.date).toLocaleDateString()}
          </span>
          <span className="meta-item">
            <User size={14} />
            {post.author}
          </span>
          <span className="category-tag">{post.category}</span>
        </div>
        <h3 className="card-title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="card-excerpt">{post.excerpt}</p>
        <Link to={`/blog/${post.slug}`} className="read-more">
          Read More
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}

export default BlogCard
