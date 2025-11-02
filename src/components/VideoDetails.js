import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./VideoDetails.css";
import Navbar from "./Navbar";

const VideoDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const projectData = location.state?.projectData;

  if (!projectData) {
    navigate("/dashboard");
    return null;
  }

  const audioInputs = [];
  for (let i = 1; i <= 5; i++) {
    const key = `audioFile${i}`;
    if (projectData[key]) {
      audioInputs.push(
        <audio controls src={projectData[key]} className="audio-player" key={key} />
      );
    }
  }

  return (
    <div className="video-details-container">
      <Navbar />
      <div className="video-details-bg">
        <main className="strict-main-layout">
          {/* Left Section */}
          <div className="strict-left">
            <div className="vd-section-label">Inputs</div>

            <div className="vd-card glassy strict-prompt-card">
              <span className="vd-label">Prompt</span>
              <div className="vd-value">{projectData.prompt}</div>
            </div>

            <div className="strict-row-below-prompt">
              <div className="vd-card glassy strict-subcard">
                <span className="vd-label">Reference Image</span>
                <div className="vd-img-holder">
                  <img src={projectData.image} alt="Reference" className="vd-img" />
                </div>
              </div>
              <div className="vd-card glassy strict-subcard">
                <span className="vd-label">{projectData.type === "audio" ? "Audio Input(s)" : "Dialogues"}</span>
                <div className="vd-media-holder">
                  {projectData.type === "audio"
                    ? audioInputs.length > 0
                      ? audioInputs
                      : <div className="vd-placeholder">No audio provided</div>
                    : <div className="vd-dialogue">{projectData.dialogue}</div>
                  }
                </div>
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="strict-right">
            <div className="vd-section-label">Final Output</div>
            <div className="vd-card glassy strict-video-card">
              <div className="vd-video-holder">
                <video controls src={projectData.video} className="vd-video" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VideoDetails;
