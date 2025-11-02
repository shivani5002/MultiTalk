import React, { useEffect, useState } from "react";
import "./CreationMode.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";



const CreationMode = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div><Navbar />
    <div className="creation-mode-page">
      <div className="creation-container">
        {/* Enhanced Animated Background Elements */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>

        {/* Animated Grid Background */}
        <div className="grid-background"></div>

        {/* Pulse Rings */}
        <div className="pulse-rings">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Enhanced Title with Animation */}
          <div className="title-container">
            <h1 className={`title ${isLoaded ? 'title-visible' : ''}`}>
              Choose Your Creation Mode
            </h1>
            <p className={`subtitle ${isLoaded ? 'subtitle-visible' : ''}`}>
              Transform your ideas into stunning AI-powered videos
            </p>
          </div>

          {/* Cards Container */}
          <div className="cards-container">
            {/* Text to Video Card - Blue Theme */}
            <div 
              className={`card text-card ${isLoaded ? 'card-visible' : ''} ${hoveredCard === 'text' ? 'card-hovered' : ''}`}
              onMouseEnter={() => setHoveredCard('text')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-border card-border-blue"></div>
              <div className="card-glow card-glow-blue"></div>
              <div className="card-sparkle"></div>
              <div className="card-content">
                <div className="card-icon icon-blue">📝</div>
                <h2 className="title-blue">Text to Video</h2>
                <p>
                  Turn your words into cinematic AI stories. Type your script and watch 
                  your text transform into stunning visuals.
                </p>
                <button className="btn btn-blue" onClick={() => navigate("/ai-creation-studio")}>
                  <span className="btn-text">Start with Text</span>
                  <span className="btn-arrow">→</span>
                  <div className="btn-shine"></div>
                </button>
              </div>
            </div>

            {/* Audio to Video Card - Pink Theme */}
            <div 
              className={`card audio-card ${isLoaded ? 'card-visible' : ''} ${hoveredCard === 'audio' ? 'card-hovered' : ''}`}
              onMouseEnter={() => setHoveredCard('audio')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-border card-border-pink"></div>
              <div className="card-glow card-glow-pink"></div>
              <div className="card-sparkle"></div>
              <div className="card-content">
                <div className="card-icon icon-pink">🎵</div>
                <h2 className="title-pink">Audio to Video</h2>
                <p>
                  Let your voice craft the scene. Upload your audio and our AI avatars 
                  bring it to life with emotion and movement.
                </p>
                <button className="btn btn-pink" onClick={() => navigate("/ai-video-studio")}>
                  <span className="btn-text">Start with Audio</span>
                  <span className="btn-arrow">→</span>
                  <div className="btn-shine"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Particle Background */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle particle-${i % 3}`}></div>
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="floating-orbs">
        <div className="orb orb-blue"></div>
        <div className="orb orb-pink"></div>
        <div className="orb orb-cyan"></div>
      </div>
    </div>
    </div>
  );
};

export default CreationMode;
