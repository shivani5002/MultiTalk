import React from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const demoVideos = [
  {
    id: 1,
    subtitle: "Single Speaker",
    type: "text",
    snippet: "Briefly describe our new Q4 strategy.",
    video: "/videos/pranav1.mp4", // Put your actual video path here
    color: "purple",
    prompt: "A young man stands confidently on an outdoor basketball court in front of a school building, smiling warmly and speaking with friendly energy. He gestures with his hands and his lips move naturally as he talks, creating an approachable presence in the schoolyard.",
    image: "/images/pranav.jpg", // Path to reference image
    dialogue: "Welcome to multi-talk, this is an audio-driven video generation model for multiple person."
  },
  {
    id: 2,
    subtitle: "Two Speaker",
    snippet: "Briefly describe our new A4 strategy.",
    video: "/videos/two.mp4", // Put your actual video path here
    color: "blue",
    type: "audio",
    prompt: "Two business professionals discussing quarterly results in a modern office setting with professional lighting.",
    image: "/images/reference2.jpg",
    audioFile1: "/audio/voiceover_sample_02.mp3",
    audioFile2: "/audio/voiceover_sample_03.mp3"
  },
  {
     id: 3,
    subtitle: "Three Speaker",
    snippet: "Briefly describe our new B4 strategy.",
    video: "/videos/three.mp4", // Put your actual video path here
    color: "green",
    type:"audio",
    prompt: "Three executives having a strategic meeting in a conference room with data visualizations on screens.",
    image: "/images/three.jpg",
    audioFile1: "/audios/s1 (1).wav",
    audioFile2: "/audios/s2 (1).wav",
    audioFile3: "/audios/s3 (1).wav"
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleViewDetails = (video) => {
    navigate("/video-details", { 
      state: { projectData: video } 
    });
  };

  return(
  <div className="dashboard-bg">
    <Navbar />

    <main className="dashboard-main-content">
      <h1 className="welcome-text">Welcome Back, Innovator!</h1>
      <p className="sub-welcome">Ready to project your vision</p>
      <button className="dashboard-btn" onClick={() => navigate("/creation-mode")}>Try Now</button>
      <div className="section-divider"></div>
      <section className="examples-section">
        <h2>Explore MultiTalk's Potential</h2>
       <div className="examples-list">
    {demoVideos.map((video, idx) => (
       <div className={`example-card ${video.color}`} key={idx}>
  <video
    src={video.video}
    controls
    width="100%"
    height="50%"
    style={{ borderRadius: '1.1rem', marginBottom: '0.9rem', objectFit: 'contain', background: '#111' }}
  />
  <div className="example-type">{video.subtitle}</div>
  <div className="example-desc">{video.snippet}</div>
  <button 
                  className="remix-btn" 
                  onClick={() => handleViewDetails(video)}
                >
                  View Details
                </button>
</div>

    ))}
    </div>
      </section>
    </main>
  </div>
);
};

export default Dashboard;
