import React, { useState } from "react";
import "./ContactPage.css";
import Navbar from "./Navbar.js";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Message sent and saved successfully!");
      setFormData({ name: "", email: "", message: "" });
    } else {
      alert("❌ Failed to send message");
    }
  } catch (err) {
    alert("⚠️ Server error");
  }
};


  return (
    <div className="contact-container">
      {/* Background Elements */}
      <div className="contact-grid-background"></div>
      <div className="contact-floating-shapes">
        <div className="contact-shape contact-shape-1"></div>
        <div className="contact-shape contact-shape-2"></div>
        <div className="contact-shape contact-shape-3"></div>
      </div>
      <div className="contact-pulse-rings">
        <div className="contact-ring contact-ring-1"></div>
        <div className="contact-ring contact-ring-2"></div>
      </div>
      <div className="contact-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`contact-particle contact-particle-${i % 3}`}></div>
        ))}
      </div>

      {/* <Navbar /> */}

      <div className="contact-content-wrapper">
        <section className="contact-hero">
          <h1 className="contact-title">
            CONNECT WITH <span>MULTITALK</span>
          </h1>
          <p className="contact-subtitle">
            Have questions or ideas? Let's build the future of AI-driven
            communication together.
          </p>
        </section>

        <section className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-container">
            <h2 className="form-title">Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <h2 className="info-title">Get in Touch</h2>
            <p className="info-desc">
              We'd love to hear from you! Reach out to our team for collaborations,
              support, or general inquiries.
            </p>

            <div className="info-details">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <span>hello@multitalk.ai</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span>Hyderabad, India</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🌐</span>
                <a href="https://multitalk.ai" target="_blank" rel="noreferrer">
                  www.multitalk.ai
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;