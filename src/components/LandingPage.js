import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="landing-container">
      <header className="navbar">
        <div className="logo">MultiTalk</div>
        <nav>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#logout">Logout</a>
        </nav>
      </header>
      
      <main className="main-content">
        <div className="hero-box">
          <div className="hero-headline">
            PROJECT YOUR VISION.<br />
            SPEAK ANY LANGUAGE
          </div>
          <div className="hero-desc">
            Transform concepts into cinematic presentations using hyper-realistic AI Avatars.<br /><br />
            Upload script, choose your world, and render in minutes.
          </div>
          <div className="cta-buttons">
            <button
              className="studio-btn"
              onClick={() => navigate("/login")}
            >
              ENTER THE STUDIO
            </button>
            <button className="avatars-btn">VIEW AVATARS</button>
          </div>
        </div>
      </main>

      <section className="feature-section">
        <h2 className="feature-title">Why Choose MultiTalk?</h2>
        <p className="feature-subtitle">
          Powerful features to create professional videos <span className="em-ph">effortlessly</span>
        </p>
        <div className="feature-cards">
          <div className="feature-card border-orange">
            <div className="feature-card-icon">🗣️</div>
            <div className="feature-card-title">Multiple Speakers</div>
            <div className="feature-card-desc">
              Add up to 10 different AI speakers to your video with unique voices and appearances
            </div>
          </div>
          <div className="feature-card border-blue">
            <div className="feature-card-icon">🎥</div>
            <div className="feature-card-title">AI-Powered Generation</div>
            <div className="feature-card-desc">
              Advanced AI technology creates realistic videos from your images and audio inputs
            </div>
          </div>
          <div className="feature-card border-purple">
            <div className="feature-card-icon">⚙️</div>
            <div className="feature-card-title">Easy To Use</div>
            <div className="feature-card-desc">
              Simple upload process and intuitive interface - no technical skills required
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-left">
          <h2 className="about-title">About MultiTalk</h2>
          <p className="about-desc">
            MultiTalk revolutionizes video creation by enabling anyone to generate professional presentations with multiple AI speakers.
            Our cutting-edge technology combines computer vision, natural language processing, and advanced video synthesis to bring your ideas to life.
          </p>
          <p className="about-desc">
            Whether you're creating marketing materials, educational content, or corporate presentations, MultiTalk makes it simple to produce engaging videos that captivate your audience.
          </p>
          <div className="about-stats">
            <div className="about-stat">
              <div className="about-stat-number">10K+</div>
              <div className="about-stat-label">Videos Created</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-number">50+</div>
              <div className="about-stat-label">Languages Supported</div>
            </div>
          </div>
        </div>
        <div className="about-right">
          <div className="about-glass">
            <div className="about-feature star">
              <span className="about-feature-icon">⭐</span>
              <span>
                <span className="about-feature-title">Industry Leading</span>
                <span className="about-feature-desc">Advanced AI technology for realistic video generation</span>
              </span>
            </div>
            <div className="about-feature user">
              <span className="about-feature-icon">👤</span>
              <span>
                <span className="about-feature-title">User Friendly</span>
                <span className="about-feature-desc">No technical expertise required - anyone can create videos</span>
              </span>
            </div>
            <div className="about-feature quality">
              <span className="about-feature-icon">🟪</span>
              <span>
                <span className="about-feature-title">High Quality</span>
                <span className="about-feature-desc">Professional grade output suitable for any use case</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="get-started-section">
        <div className="get-started-center">
          <h2 className="get-started-title">Ready to Get Started?</h2>
          <p className="get-started-subtitle">
            Join thousands of creators using MultiTalk to create amazing videos.
          </p>
          <button
            className="get-started-btn"
            onClick={() => navigate("/login")}
          >
            Start Creating
          </button>
          <div className="get-started-contact">
            Contact us: <a href="mailto:hello@multitalk.ai">hello@multitalk.ai</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;