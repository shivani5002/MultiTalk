import React, { useState, useRef, useEffect } from 'react';
import './AIVideoStudio.css';
import Navbar from "./Navbar";
import GeminiAssistant from './GeminiAssistant';

// Backend API URL
const BACKEND_API = 'https://43d151711e9e.ngrok-free.app'; // Update to your ngrok URL

const AIVideoStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [speakerCount, setSpeakerCount] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [uploadedAudioFiles, setUploadedAudioFiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // Poll job status
  useEffect(() => {
    if (jobId && jobStatus === 'processing') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${BACKEND_API}/api/status/${jobId}`);
          const data = await response.json();
          setJobStatus(data.status);
          
          if (data.status === 'completed') {
            clearInterval(interval);
            setProgress(100);
            alert('Video generation completed! You can now download the video.');
          }
        } catch (error) {
          console.error('Error checking status:', error);
        }
      }, 5000); // Check every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [jobId, jobStatus]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setUploadedImageFile(file);
      console.log('📸 Image uploaded:', file.name, file.size, 'bytes');
    }
  };

  const handleAudioUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    if (newFiles.length > 0) {
      // ✅ APPEND to existing files instead of replacing
      setUploadedAudioFiles(prev => {
        const combined = [...prev, ...newFiles];
        
        // Limit total to 3 files
        const limitedFiles = combined.slice(0, 3);
        
        if (combined.length > 3) {
          alert(`Maximum 3 speakers supported. You uploaded ${combined.length} files, using first 3.`);
        }
        
        setSpeakerCount(limitedFiles.length);
        console.log(`🎵 ${limitedFiles.length} audio file(s) total`);
        
        return limitedFiles;
      });
    }
  };

  const handleGenerateVideo = async () => {
    if (!uploadedImageFile) {
      alert('Please upload an image first!');
      return;
    }

    // ✅ FIXED: Allow 1, 2, or 3 audio files
    if (uploadedAudioFiles.length === 0) {
      alert('Please upload at least 1 audio file!');
      return;
    }
    
    if (uploadedAudioFiles.length > 3) {
      alert('Maximum 3 audio files supported!');
      return;
    }

    setIsGenerating(true);
    setJobStatus('processing');

    try {
      const formData = new FormData();
      formData.append('image', uploadedImageFile);
      
      // ✅ Send all audio files - backend will handle 1, 2, or 3
      uploadedAudioFiles.forEach((audioFile) => {
        formData.append('audio_files', audioFile);
      });
      
      const config = {
        prompt: prompt || 'A person speaking with synchronized lip movements.'
      };
      formData.append('config', JSON.stringify(config));

      console.log('📤 Video Generation Request:', {
        image: uploadedImageFile.name,
        audioFiles: uploadedAudioFiles.map(f => f.name),
        config: config
      });

      const response = await fetch(`${BACKEND_API}/api/generate-audio-video`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setJobId(result.job_id);
        setJobStatus('started');
        console.log('✅ Job started:', result.job_id);
        alert('Video generation started!');
      } else {
        throw new Error(result.error || 'Backend error');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert(`Error: ${error.message}`);
      setJobStatus(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerAudioInput = () => {
    audioInputRef.current?.click();
  };

  const removeAudio = (indexToRemove) => {
    setUploadedAudioFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setSpeakerCount(prev => Math.max(0, prev - 1));
  };

  const downloadVideo = () => {
    if (jobId) {
      window.open(`${BACKEND_API}/api/download/${jobId}`, '_blank');
    }
  };

  const handlePromptGenerated = (generatedPrompt) => {
    setPrompt(generatedPrompt);
  };

  const handleImageGenerated = (imageData) => {
    // Convert base64 to blob and create File object
    const byteCharacters = atob(imageData.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    const file = new File([blob], 'generated-image.png', { type: 'image/png' });
    
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setUploadedImageFile(file);
    console.log('✅ Generated image set as reference');
  };

  const handleDialogueGenerated = (dialogues) => {
    console.log('Dialogue generated:', dialogues);
  };

  return (
    <div className="ai-studio">
      <Navbar />

      <GeminiAssistant
        onPromptGenerated={handlePromptGenerated}
        onImageGenerated={handleImageGenerated}
        onDialogueGenerated={handleDialogueGenerated}
        currentSpeakers={Array(speakerCount).fill(null).map((_, i) => ({ id: `S${i + 1}` }))}
      />

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
                    Audio Tracks ({uploadedAudioFiles.length} / 3)
                  </label>

                  <div className="audio-upload-container">
                    <div 
                      className={`audio-upload-box ${uploadedAudioFiles.length > 0 ? 'has-audio' : ''}`}
                      onClick={triggerAudioInput}
                    >
                      <input
                        type="file"
                        ref={audioInputRef}
                        onChange={handleAudioUpload}
                        accept="audio/*"
                        multiple
                        style={{ display: 'none' }}
                      />
                      
                      {uploadedAudioFiles.length > 0 ? (
                        <div className="audio-list">
                          {uploadedAudioFiles.map((file, index) => (
                            <div key={index} className="audio-item">
                              <div className="audio-visualizer">
                                <div className="visualizer-bar"></div>
                                <div className="visualizer-bar"></div>
                                <div className="visualizer-bar"></div>
                              </div>
                              <div className="audio-info">
                                <span className="audio-name">Speaker {index + 1}: {file.name}</span>
                                <span className="audio-details">
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </div>
                              <button 
                                className="remove-audio-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeAudio(index);
                                }}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="audio-upload-placeholder">
                          <div className="audio-upload-icon">
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                          </div>
                          <div className="audio-upload-content">
                            <p className="audio-upload-title">Upload Audio Files</p>
                            <p className="audio-upload-desc">Drag & drop or click to browse (Max 3 files)</p>
                            <span className="audio-supported">Supports: MP3, WAV, M4A</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Speaker Count Display */}
                {uploadedAudioFiles.length > 0 && (
                  <div className="input-group">
                    <label className="input-label">
                      <i className="fa-solid fa-users label-icon"></i>
                      Speaker Configuration
                    </label>
                    <div className="speaker-info">
                      <i className="fa-solid fa-circle-info"></i>
                      <span>{speakerCount} speaker{speakerCount > 1 ? 's' : ''} detected from audio files</span>
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
          {jobStatus === 'completed' ? (
            <button 
              className="generate-btn"
              onClick={downloadVideo}
            >
              <div className="btn-content">
                <i className="fa-solid fa-download"></i>
                <span>Download Video</span>
              </div>
              <div className="btn-glow"></div>
            </button>
          ) : (
            <button 
              className={`generate-btn ${isGenerating ? 'generating' : ''} ${
                !prompt || !uploadedImage || uploadedAudioFiles.length === 0 ? 'disabled' : ''
              }`}
              onClick={handleGenerateVideo}
              disabled={isGenerating || !prompt || !uploadedImage || uploadedAudioFiles.length === 0}
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
          )}

          {/* Status Display */}
          {jobStatus && jobStatus !== 'completed' && (
            <div className="progress-section">
              <div className="progress-stats">
                <span className="progress-text">
                  {jobStatus === 'processing' ? '⏳ Generating video...' : '🚀 Starting generation...'}
                </span>
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
