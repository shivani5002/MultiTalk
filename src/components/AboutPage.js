import React from "react";
import "./AboutPage.css";
import Navbar from "./Navbar";

const AboutPage = () => {
  return (
    <div className="aboutpage-container">
      {/* Background Elements */}
      <div className="about-grid-background"></div>
      <div className="about-floating-shapes">
        <div className="about-shape about-shape-1"></div>
        <div className="about-shape about-shape-2"></div>
        <div className="about-shape about-shape-3"></div>
      </div>
      <div className="about-pulse-rings">
        <div className="about-ring about-ring-1"></div>
        <div className="about-ring about-ring-2"></div>
      </div>
      <div className="about-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`about-particle about-particle-${i % 3}`}></div>
        ))}
      </div>

      {/* <Navbar /> */}

      <div className="aboutpage-content">
        {/* Hero Section */}
        <section className="about-hero">
          <h1 className="about-hero-title">
            REDEFINING HUMAN CONVERSATION<br />THROUGH AI.
          </h1>
          <p className="about-hero-desc">
            MultiTalk transforms simple audio and text inputs into lifelike,
            multi-speaker video conversations. By combining <span>speech
            intelligence</span>, <span>computer vision</span>, and <span>generative
            video synthesis</span>, we bring avatars to life with natural motion
            and emotion.
          </p>
        </section>

        {/* What Sets Us Apart */}
        <section className="about-difference">
          <h2 className="about-section-title">WHAT SETS US APART</h2>
          <div className="about-cards">
            <div className="about-card border-pink">
              <div className="about-icon">🧠</div>
              <h3 className="about-card-title">Multi-Speaker Realism</h3>
              <p className="about-card-desc">
                Multiple AI avatars interact naturally, maintaining perfect
                dialogue flow and scene coherence.
              </p>
            </div>
            <div className="about-card border-blue">
              <div className="about-icon">🎙️</div>
              <h3 className="about-card-title">Precision Audio Binding</h3>
              <p className="about-card-desc">
                Each voice is accurately mapped using <span>L-RoPE</span> for
                seamless lip and body synchronization.
              </p>
            </div>
            <div className="about-card border-green">
              <div className="about-icon">⚙️</div>
              <h3 className="about-card-title">Instruction-Following Animation</h3>
              <p className="about-card-desc">
                Avatars respond to emotions, tone, and gestures through
                context-aware AI control.
              </p>
            </div>
            <div className="about-card border-purple">
              <div className="about-icon">🌍</div>
              <h3 className="about-card-title">Scalable Design</h3>
              <p className="about-card-desc">
                Scales from 2 to 10 speakers with consistent realism and
                synchronization.
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="about-vision">
          <h2 className="about-section-title">CREATING THE FUTURE OF DIGITAL COMMUNICATION</h2>
          <p className="about-vision-text">
            We envision a world where <span>AI and human creativity</span> coexist.
            From virtual meetings to immersive storytelling, MultiTalk is
            revolutionizing how conversations are visualized — expressive,
            intelligent, and deeply human.
          </p>
        </section>

        {/* Tech Section */}
        <section className="about-tech">
          <h2 className="about-section-title">POWERED BY DEEP LEARNING AND CREATIVE ENGINEERING</h2>
          <div className="tech-grid">
            <div className="tech-box">
              <h3>🎧 Audio-Driven Animation</h3>
              <p>
                Converts voice features into synchronized facial and body motion
                with emotion tracking.
              </p>
            </div>
            <div className="tech-box">
              <h3>🧩 Instruction Parsing Engine</h3>
              <p>
                Understands natural prompts to generate gestures, tone, and
                expressions dynamically.
              </p>
            </div>
            <div className="tech-box">
              <h3>🎬 Video Rendering Pipeline</h3>
              <p>
                Combines every element into cinematic, production-grade sequences
                ready for deployment.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <h2 className="cta-title">LET YOUR IDEAS SPEAK.</h2>
          <p className="cta-desc">
            Whether you're a creator, educator, or innovator — transform your
            imagination into cinematic AI-powered conversations.
          </p>
          <button
            className="cta-button"
            onClick={() => (window.location.href = "/login")}
          >
            ENTER THE STUDIO
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;