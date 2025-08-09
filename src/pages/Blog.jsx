import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import { blogPosts, getPostsByCategory, getAllCategories } from '../data/blogPosts'
import './Blog.css'

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)
  
  const categories = getAllCategories()

  useEffect(() => {
    if (selectedCategory) {
      setFilteredPosts(getPostsByCategory(selectedCategory))
      setSearchParams({ category: selectedCategory })
    } else {
      setFilteredPosts(blogPosts)
      setSearchParams({})
    }
  }, [selectedCategory, setSearchParams])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
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
            onClick={() => handleCategoryChange('')}
          >
            All Posts
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="blog-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))
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
