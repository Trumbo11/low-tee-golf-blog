import React from 'react'
import { Award, Users, Target, Heart } from 'lucide-react'
import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <header className="about-header">
          <h1>About Low Tee Golf</h1>
          <p>Your trusted source for golf expertise, course insights, and equipment guidance</p>
        </header>

        <section className="about-content">
          <div className="about-story">
            <h2>Our Story</h2>
            <p>
              Low Tee Golf was founded with a simple mission: to help golfers of all skill levels 
              improve their game and enjoy this incredible sport even more. Whether you're just 
              starting your golf journey or you're a seasoned player looking to shave strokes 
              off your handicap, we're here to provide the insights, tips, and guidance you need.
            </p>
            <p>
              Our team consists of passionate golfers, PGA professionals, and course enthusiasts 
              who have combined their love for the game with years of experience to bring you 
              the most comprehensive golf content on the web.
            </p>
          </div>

          <div className="values-section">
            <h2>What We Stand For</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <Target size={40} />
                </div>
                <h3>Precision</h3>
                <p>We provide accurate, well-researched content to help you make informed decisions about your golf game.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Users size={40} />
                </div>
                <h3>Community</h3>
                <p>Golf is better when shared. We foster a community of golfers helping each other improve.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Award size={40} />
                </div>
                <h3>Excellence</h3>
                <p>We strive for excellence in everything we do, from course reviews to equipment testing.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Heart size={40} />
                </div>
                <h3>Passion</h3>
                <p>Our love for golf drives everything we do. We're golfers writing for golfers.</p>
              </div>
            </div>
          </div>

          <div className="team-section">
            <h2>Meet Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-photo">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" alt="Mike Johnson" />
                </div>
                <h3>Mike Johnson</h3>
                <p className="member-title">Founder & Lead Writer</p>
                <p>15+ years of golf experience, former college player, passionate about helping others improve their game.</p>
              </div>
              <div className="team-member">
                <div className="member-photo">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face" alt="Sarah Williams" />
                </div>
                <h3>Sarah Williams</h3>
                <p className="member-title">Course Review Specialist</p>
                <p>Traveled to over 100 golf courses worldwide, expert in course design and architecture.</p>
              </div>
              <div className="team-member">
                <div className="member-photo">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="David Chen" />
                </div>
                <h3>David Chen</h3>
                <p className="member-title">Equipment Expert</p>
                <p>Former golf shop professional with deep knowledge of golf equipment and technology.</p>
              </div>
              <div className="team-member">
                <div className="member-photo">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" alt="Jennifer Lopez" />
                </div>
                <h3>Jennifer Lopez</h3>
                <p className="member-title">Golf News Reporter</p>
                <p>Sports journalist covering professional golf tours and industry news for over 10 years.</p>
              </div>
            </div>
          </div>

          <div className="mission-section">
            <h2>Our Mission</h2>
            <div className="mission-content">
              <p>
                At Low Tee Golf, we believe that golf is more than just a game – it's a lifelong 
                journey of improvement, challenge, and enjoyment. Our mission is to be your 
                trusted companion on this journey, providing you with:
              </p>
              <ul>
                <li>Expert tips and instruction to improve your technique</li>
                <li>Honest, detailed reviews of golf courses around the world</li>
                <li>Comprehensive equipment guides to help you make smart purchases</li>
                <li>Up-to-date news and insights from the world of professional golf</li>
                <li>A community where golfers can learn, share, and grow together</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
