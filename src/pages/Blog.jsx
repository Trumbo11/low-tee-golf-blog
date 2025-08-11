import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import { blogPosts, getPostsByCategory, getAllCategories } from '../data/blogPosts'
import './Blog.css'

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read the category directly from the URL every render
  const selectedCategory = searchParams.get('category') || ''

  // Derive posts from the selected category (no local state needed)
  const filteredPosts = useMemo(() => {
    return selectedCategory ? getPostsByCategory(selectedCategory) : blogPosts
  }, [selectedCategory])

  const categories = getAllCategories()

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
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <BlogCard key={post.id} post={post} />)
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
