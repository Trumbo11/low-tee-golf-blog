import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const categoryTo = (category) => {
    const params = new URLSearchParams(location.search);
    params.set('category', category);
    params.set('utm_source', 'footer'); // replace/update every click
    return {
      pathname: '/blog',
      search: `?${params.toString()}`
    };
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Low Tee Golf</h3>
            <p>Your premier destination for golf tips, course reviews, and the latest golf news.</p>
            <div className="social-links">
              {/* Add social media icons here when available */}
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to={categoryTo('Tips')}>Golf Tips</Link></li>



              <li><Link to="/blog?category=reviews">Course Reviews</Link></li>
              <li><Link to="/blog?category=equipment">Equipment</Link></li>
              <li><Link to="/blog?category=news">Golf News</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>info@lowteegolf.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>(555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Golf Course Lane, Golf City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Low Tee Golf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
