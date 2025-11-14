import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="landing-container">
      <Navbar />
      
      <main className="main-content">
        <div className="hero-box">
          <div className="hero-headline">
            IMAGINE YOUR UNIVERSE.<br />
            SPEAK IT INTO REALITY.
          </div>
          <div className="hero-desc">
           Turn imagination into reality with lifelike AI-driven avatars. <br></br>
Upload your script, define your world, and watch it come alive in minutes.

          </div>
          <div className="cta-buttons">
            <button
              className="studio-btn"
              onClick={() => navigate("/login")}
            >
              ENTER THE STUDIO
            </button>
            {/* <button className="avatars-btn">VIEW AVATARS</button> */}
          </div>
        </div>
      </main>

      <section className="feature-section">
        <h2 className="feature-title">Why Choose MultiTalk?</h2>
        <p className="feature-subtitle">
         Advanced features to craft cinematic, multi-speaker experiences effortlessly <span className="em-ph">effortlessly</span>
        </p>
        <div className="feature-cards">
          <div className="feature-card border-orange">
            <div className="feature-card-icon">🗣️</div>
            <div className="feature-card-title">Multiple Speakers</div>
            <div className="feature-card-desc">
             Add up to multiple AI speakers — each with distinct voices, styles, and personalities
            </div>
          </div>
          <div className="feature-card border-blue">
            <div className="feature-card-icon">🎥</div>
            <div className="feature-card-title">AI-Powered Generation</div>
            <div className="feature-card-desc">
              Generate hyper-realistic avatars from voice, image, and text with perfect lip and body sync
            </div>
          </div>
          <div className="feature-card border-purple">
            <div className="feature-card-icon">⚙️</div>
            <div className="feature-card-title">Easy To Use</div>
            <div className="feature-card-desc">
              Simple, seamless, and intuitive — create production-quality videos with just a few clicks
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
            Join creators transforming imagination into cinematic AI-powered conversations.
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