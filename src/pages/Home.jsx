import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, Award, BookOpen } from 'lucide-react'
import BlogCard from '../components/BlogCard'
import { getFeaturedPosts } from '../data/blogPosts'
import { isCmsEnabled, fetchPostsFromCms } from '../services/cms'

const Home = () => {
  const [remotePosts, setRemotePosts] = useState(null)
  const [remoteError, setRemoteError] = useState(null)

  useEffect(() => {
    let isActive = true
    const run = async () => {
      if (!isCmsEnabled()) {
        setRemotePosts(null)
        return
      }
      try {
        const posts = await fetchPostsFromCms({ featured: true })
        if (isActive) setRemotePosts(posts)
      } catch (err) {
        if (isActive) setRemoteError(err)
      }
    }
    run()
    return () => { isActive = false }
  }, [])

  const featuredPosts = useMemo(() => {
    if (remotePosts && !remoteError) return remotePosts
    return getFeaturedPosts()
  }, [remotePosts, remoteError])

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to Low Tee Golf</h1>
          <p>Your premier destination for golf tips, course reviews, equipment guides, and the latest golf news</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/blog" className="btn">
              Read Latest Posts
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Low Tee Golf?</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={48} />
              </div>
              <h3>Expert Tips</h3>
              <p>Get professional golf tips from experienced players and coaches to improve your game.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={48} />
              </div>
              <h3>Course Reviews</h3>
              <p>Detailed reviews of golf courses around the world, helping you choose your next golf destination.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BookOpen size={48} />
              </div>
              <h3>Equipment Guides</h3>
              <p>Comprehensive equipment reviews and buying guides to help you make informed decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="section" style={{ backgroundColor: 'var(--golf-gray)' }}>
        <div className="container">
          <h2 className="section-title">Featured Posts</h2>
          <div className="grid grid-2">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/blog" className="btn">
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section">
        <div className="container">
          <div className="newsletter-section">
            <h2>Stay Updated with Low Tee Golf</h2>
            <p>Get the latest golf tips, course reviews, and equipment guides delivered to your inbox.</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <button className="btn">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
