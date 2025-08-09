import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact-page">
      <div className="container">
        <header className="contact-header">
          <h1>Contact Us</h1>
          <p>Have a question or want to get in touch? We'd love to hear from you.</p>
        </header>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Whether you have a question about golf, want to suggest a course review, 
              or are interested in collaborating with us, don't hesitate to reach out. 
              We're always happy to connect with fellow golf enthusiasts!
            </p>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-details">
                  <h3>Email Us</h3>
                  <p>info@lowteegolf.com</p>
                  <p className="contact-note">We typically respond within 24 hours</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-details">
                  <h3>Call Us</h3>
                  <p>(555) 123-4567</p>
                  <p className="contact-note">Monday - Friday, 9 AM - 5 PM EST</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <MapPin size={24} />
                </div>
                <div className="contact-details">
                  <h3>Visit Us</h3>
                  <p>123 Golf Course Lane</p>
                  <p>Golf City, GC 12345</p>
                </div>
              </div>
            </div>

            <div className="business-hours">
              <h3>Business Hours</h3>
              <div className="hours-list">
                <div className="hour-item">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="hour-item">
                  <span>Saturday</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="hour-item">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="course-suggestion">Course Review Suggestion</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="feedback">Website Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How often do you publish new content?</h3>
              <p>We publish new blog posts 2-3 times per week, covering tips, course reviews, equipment guides, and golf news.</p>
            </div>
            <div className="faq-item">
              <h3>Can I suggest a golf course for review?</h3>
              <p>Absolutely! We love hearing course suggestions from our readers. Use the contact form above or email us directly.</p>
            </div>
            <div className="faq-item">
              <h3>Do you accept guest posts?</h3>
              <p>We occasionally accept high-quality guest posts from golf professionals and experienced players. Contact us with your ideas!</p>
            </div>
            <div className="faq-item">
              <h3>How can I stay updated with new posts?</h3>
              <p>Subscribe to our newsletter on the homepage to receive the latest posts and golf tips directly in your inbox.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
