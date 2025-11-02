import React, { useState, useRef } from 'react';
import './AIVideoStudio.css';
import Navbar from "./Navbar";

const AIVideoStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [speakerCount, setSpeakerCount] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const [audioName, setAudioName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedAudio(file);
      setAudioName(file.name);
    }
  };

  const handleGenerateVideo = () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate video generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsGenerating(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerAudioInput = () => {
    audioInputRef.current?.click();
  };

  const removeAudio = () => {
    setUploadedAudio(null);
    setAudioName('');
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  return (
    <div className="ai-studio">
      <Navbar />
      {/* Animated Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Main Content */}
      <div className="main-container">
        {/* Header Section */}
        <header className="main-header">
          <div className="header-content">
            <div className="logo-title">
              <i className="fa-solid fa-wand-magic-sparkles logo-icon"></i>
              <h1 className="main-title">AI Video Studio</h1>
            </div>
            <p className="tagline">Bring Your Images to Life with AI Magic</p>
          </div>
        </header>

        {/* Main Cards Container */}
        <div className="cards-container">
          {/* Left Card - Input Configuration */}
          <div className="main-card blue-glow">
            <div className="card-decoration">
              <div className="decoration-dot dot-1"></div>
              <div className="decoration-dot dot-2"></div>
              <div className="decoration-line"></div>
            </div>
            
            <div className="card-header">
              <div className="card-title-section">
                <i className="fa-solid fa-sliders card-title-icon"></i>
                <h2 className="card-title">Video Configuration</h2>
              </div>
              <div className="card-badge">AI POWERED</div>
            </div>

            <div className="card-content">
              {/* Prompt Section */}
              <div className="input-section">
                <div className="input-group">
                  <label className="input-label">
                    <i className="fa-solid fa-pen-fancy label-icon"></i>
                    Creative Prompt
                  </label>
                  <div className="textarea-container">
                    <textarea
                      className="styled-textarea"
                      placeholder="Describe the magical scene you want to create... Be as detailed as possible about characters, actions, and atmosphere."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows="4"
                    />
                    <div className="textarea-footer">
                      <span className="char-count">{prompt.length}/500</span>
                      <i className="fa-solid fa-sparkles textarea-icon"></i>
                    </div>
                  </div>
                </div>

                {/* Audio Upload Section */}
                <div className="input-group">
                  <label className="input-label">
                    <i className="fa-solid fa-music label-icon"></i>
                    Audio Track
                  </label>
                  <div className="audio-upload-container">
                    <div 
                      className={`audio-upload-box ${uploadedAudio ? 'has-audio' : ''}`}
                      onClick={triggerAudioInput}
                    >
                      <input
                        type="file"
                        ref={audioInputRef}
                        onChange={handleAudioUpload}
                        accept="audio/*"
                        style={{ display: 'none' }}
                      />
                      
                      {uploadedAudio ? (
                        <div className="audio-preview">
                          <div className="audio-visualizer">
                            <div className="visualizer-bar"></div>
                            <div className="visualizer-bar"></div>
                            <div className="visualizer-bar"></div>
                            <div className="visualizer-bar"></div>
                            <div className="visualizer-bar"></div>
                          </div>
                          <div className="audio-info">
                            <span className="audio-name">{audioName}</span>
                            <span className="audio-details">
                              {(uploadedAudio.size / (1024 * 1024)).toFixed(2)} MB • Ready to use
                            </span>
                          </div>
                          <button 
                            className="remove-audio-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAudio();
                            }}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="audio-upload-placeholder">
                          <div className="audio-upload-icon">
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                          </div>
                          <div className="audio-upload-content">
                            <p className="audio-upload-title">Upload Audio File</p>
                            <p className="audio-upload-desc">Drag & drop or click to browse</p>
                            <span className="audio-supported">Supports: MP3, WAV, M4A</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {uploadedAudio && (
                      <div className="audio-controls">
                        <audio controls className="audio-player">
                          <source src={URL.createObjectURL(uploadedAudio)} type={uploadedAudio.type} />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                </div>

                {/* Speaker Selection */}
                {uploadedAudio && (
                  <div className="input-group">
                    <label className="input-label">
                      <i className="fa-solid fa-users label-icon"></i>
                      Speaker Configuration
                    </label>
                    <div className="speaker-selection">
                      <select 
                        className="speaker-dropdown"
                        value={speakerCount}
                        onChange={(e) => setSpeakerCount(parseInt(e.target.value))}
                      >
                        <option value={0}>Select number of speakers...</option>
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>
                            {num} Speaker{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                      <div className="speaker-info">
                        <i className="fa-solid fa-circle-info"></i>
                        <span>Choose based on your audio content</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Card - Image Upload */}
          <div className="main-card magenta-glow">
            <div className="card-decoration">
              <div className="decoration-dot dot-1"></div>
              <div className="decoration-dot dot-2"></div>
              <div className="decoration-line"></div>
            </div>

            <div className="card-header">
              <div className="card-title-section">
                <i className="fa-solid fa-image card-title-icon"></i>
                <h2 className="card-title">Visual Source</h2>
              </div>
              <div className="card-badge">UPLOAD</div>
            </div>

            <div className="card-content">
              <div className="upload-section">
                <div 
                  className={`upload-area ${uploadedImage ? 'has-image' : ''}`}
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  {uploadedImage ? (
                    <div className="image-preview">
                      <img src={uploadedImage} alt="Upload preview" />
                      <div className="image-overlay">
                        <div className="overlay-content">
                          <i className="fa-solid fa-rotate overlay-icon"></i>
                          <span>Click to change image</span>
                        </div>
                      </div>
                      <div className="image-badge">
                        <i className="fa-solid fa-check"></i>
                        Ready
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </div>
                      <div className="upload-content">
                        <h3 className="upload-title">Upload Your Image</h3>
                        <p className="upload-desc">
                          Drag & drop your image here or click to browse
                        </p>
                        <div className="upload-features">
                          <span className="feature">
                            <i className="fa-solid fa-check"></i>
                            High quality
                          </span>
                          <span className="feature">
                            <i className="fa-solid fa-check"></i>
                            Fast processing
                          </span>
                        </div>
                        <span className="image-supported">JPG, PNG, WebP • Max 10MB</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Stats */}
                {uploadedImage && (
                  <div className="image-stats">
                    <div className="stat">
                      <span className="stat-label">Status</span>
                      <span className="stat-value ready">Ready for AI</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Format</span>
                      <span className="stat-value">Image</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="generate-section">
          <button 
            className={`generate-btn ${isGenerating ? 'generating' : ''} ${
              !prompt || !uploadedImage ? 'disabled' : ''
            }`}
            onClick={handleGenerateVideo}
            disabled={isGenerating || !prompt || !uploadedImage}
          >
            <div className="btn-content">
              {isGenerating ? (
                <>
                  <div className="btn-spinner">
                    <div className="spinner-ring"></div>
                  </div>
                  <span>Creating Magic...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  <span>Generate AI Video</span>
                </>
              )}
            </div>
            <div className="btn-glow"></div>
          </button>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="progress-section">
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-stats">
                <span className="progress-text">Processing: {progress}%</span>
                <span className="progress-time">Estimated: 30s</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <footer className="info-footer">
          <div className="info-items">
            <div className="info-item">
              <i className="fa-solid fa-bolt"></i>
              <span>Fast AI Processing</span>
            </div>
            <div className="info-item">
              <i className="fa-solid fa-shield"></i>
              <span>Secure & Private</span>
            </div>
            <div className="info-item">
              <i className="fa-solid fa-infinity"></i>
              <span>Unlimited Creativity</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AIVideoStudio;
