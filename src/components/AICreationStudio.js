import React, { useState, useEffect } from 'react';
import './AICreationStudio.css';
import Navbar from './Navbar';
import GeminiAssistant from './GeminiAssistant';

// Constants for Voice Options
const voiceOptions = [
    { value: "af_bella", text: "Bella (African Female)" },
    { value: "af_nova", text: "Nova (African Female)" },
    { value: "af_onyx", text: "Onyx (African Female)" },
    { value: "af_alloy", text: "Alloy (African Female)" },
    { value: "am_michael", text: "Michael (American Male)" },
    { value: "am_echo", text: "Echo (American Male)" },
    { value: "am_fable", text: "Fable (American Male)" },
    { value: "am_sky", text: "Sky (American Male)" },
    { value: "as_liam", text: "Liam (Asian Male)" },
    { value: "as_shimmer", text: "Shimmer (Asian Female)" },
    { value: "eu_stella", text: "Stella (European Female)" },
    { value: "eu_ash", text: "Ash (European Male)" },
    { value: "sa_aria", text: "Aria (South Asian Female)" },
    { value: "sa_sage", text: "Sage (South Asian Male)" },
    { value: "zm_yunxia", text: "Yunxia (Chinese Female)" },
    { value: "zm_yunyang", text: "Yunyang (Chinese Male)" }
];

// Backend API URL (Update this to your ngrok URL)
const BACKEND_API = 'https://9b4bcdd45fcb.ngrok-free.app';

function AICreationStudio() {
    // --- State Management ---
    const [promptInput, setPromptInput] = useState('');
    const [dialogueLines, setDialogueLines] = useState([
        { id: 1, speakerId: '', text: 'Line 1' },
        { id: 2, speakerId: '', text: 'Line 2' },
        { id: 3, speakerId: '', text: 'Line ...' },
    ]);
    const [speakers, setSpeakers] = useState([]);
    const [numSpeakersInput, setNumSpeakersInput] = useState(3);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageFile, setUploadedImageFile] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [jobId, setJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    const [generatedVideo, setGeneratedVideo] = useState(null);

    // ADD: Callback to handle prompt from Gemini
    const handlePromptFromGemini = (generatedPrompt) => {
        setPromptInput(generatedPrompt);
    };

    // ADD: Callback to handle dialogue from Gemini
    const handleDialogueFromGemini = (generatedDialogues) => {
        const newDialogues = generatedDialogues.map((dialogue, index) => ({
            id: index + 1,
            speakerId: dialogue.speakerId || `S${index + 1}`,
            text: dialogue.text
        }));
        setDialogueLines(newDialogues);
    };

    // ADD: Callback to handle image from Gemini
    const handleImageFromGemini = (imageData) => {
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

    // --- Effects for Speaker Management ---
    useEffect(() => {
        setSpeakers(prevSpeakers => {
            const newSpeakers = [];
            for (let i = 0; i < numSpeakersInput; i++) {
                const existingSpeaker = prevSpeakers[i];
                newSpeakers.push({
                    id: `S${i + 1}`,
                    name: existingSpeaker?.name || `Speaker ${i + 1}`,
                    voice: existingSpeaker?.voice || ''
                });
            }
            return newSpeakers;
        });
    }, [numSpeakersInput]);

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
                        setGeneratedVideo(`${BACKEND_API}/api/video/${jobId}`);
                        console.log('✅ Video generation completed!');
                    }
                } catch (error) {
                    console.error('Error checking status:', error);
                }
            }, 5000);
            
            return () => clearInterval(interval);
        }
    }, [jobId, jobStatus]);

    // --- Handlers ---
    const handlePromptChange = (e) => {
        setPromptInput(e.target.value);
    };

    const handleDialogueTextChange = (id, newText) => {
        setDialogueLines(prevLines =>
            prevLines.map(line => (line.id === id ? { ...line, text: newText } : line))
        );
    };

    const handleDialogueSpeakerChange = (id, newSpeakerId) => {
        setDialogueLines(prevLines =>
            prevLines.map(line => (line.id === id ? { ...line, speakerId: newSpeakerId } : line))
        );
    };

    const addDialogueLine = () => {
        const newId = dialogueLines.length > 0 ? Math.max(...dialogueLines.map(line => line.id)) + 1 : 1;
        setDialogueLines(prevLines => [
            ...prevLines,
            { id: newId, speakerId: '', text: '' },
        ]);
    };

    const removeDialogueLine = (id) => {
        setDialogueLines(prevLines => prevLines.filter(line => line.id !== id));
    };

    const handleSpeakerVoiceChange = (id, newVoice) => {
        setSpeakers(prevSpeakers =>
            prevSpeakers.map(speaker => (speaker.id === id ? { ...speaker, voice: newVoice } : speaker))
        );
    };

    const handleNumSpeakersInputChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 0) value = 0;
        if (value > 10) value = 10;
        setNumSpeakersInput(value);
    };

    const incrementNumSpeakers = () => {
        setNumSpeakersInput(prev => Math.min(prev + 1, 10));
    };

    const decrementNumSpeakers = () => {
        setNumSpeakersInput(prev => Math.max(prev - 1, 0));
    };

    const removeSpeaker = (indexToRemove) => {
        setNumSpeakersInput(prev => Math.max(prev - 1, 0));
    };

     // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
            setUploadedImageFile(file);
            console.log('📸 Image uploaded:', file.name, file.size, 'bytes');
        }
    };

    // Download generated video
    const downloadVideo = async () => {
        if (jobId) {
            window.open(`${BACKEND_API}/api/download/${jobId}`, '_blank');
        }
    };

    // Reset and create another video
    const createAnotherVideo = () => {
        setJobStatus(null);
        setJobId(null);
        setGeneratedVideo(null);
    };

    // Main function to send to backend
    const forgeMasterpiece = async () => {
        if (!uploadedImageFile) {
            alert('Please upload an image first!');
            return;
        }

        setIsGenerating(true);
        setJobStatus('processing');
        setGeneratedVideo(null);
        
        const activeLines = dialogueLines.filter(line => line.speakerId && line.text.trim());
        
        if (activeLines.length === 0) {
            alert('Please add at least one dialogue line!');
            setIsGenerating(false);
            setJobStatus(null);
            return;
        }

        try {
            const isSingleSpeaker = speakers.length === 1;
            
            const dialogueText = dialogueLines
                .filter(line => line.speakerId && line.text.trim())
                .map(line => {
                    if (isSingleSpeaker) {
                        return line.text;
                    } else {
                        return `(${line.speakerId.toLowerCase()}) ${line.text}`;
                    }
                })
                .join(' ');

            const ttsAudio = {
                text: dialogueText
            };

            speakers.forEach(speaker => {
                if (speaker.voice) {
                    const speakerNumber = speaker.id.toLowerCase().replace('s', '');
                    const speakerKey = `human${speakerNumber}_voice`;
                    ttsAudio[speakerKey] = `/content/drive/MyDrive/weights/Kokoro-82M/voices/${speaker.voice}.pt`;
                }
            });

            const config = {
                "prompt": promptInput || 'A new avatar video.',
                "tts_audio": ttsAudio
            };

            console.log('📤 Sending JSON to backend:');
            console.log('Config JSON:', JSON.stringify(config, null, 2));

            const formData = new FormData();
            formData.append('image', uploadedImageFile);
            formData.append('config', JSON.stringify(config));

            console.log('🔄 Sending request to backend...');

            const response = await fetch(`${BACKEND_API}/api/generate-tts-video`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setJobId(result.job_id);
                setJobStatus('processing');
                console.log('✅ Backend response:', result);
            } else {
                const errorText = await response.text();
                console.error('❌ Backend error:', errorText);
                throw new Error(`Backend error: ${response.status} - ${errorText}`);
            }

        } catch (error) {
            console.error('❌ Error:', error);
            alert('Error starting video generation. Please check the console for details.');
            setJobStatus(null);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="ai-creation-studio">
            <Navbar />
            <div className="app-container">
                <main className="ai-creation-studio__main-wrapper">
                    {/* Section 1: Conceptualize */}
                    <section id="section-conceptualize" className="ai-creation-studio__section">
                        <div className="ai-creation-studio__section-header">
                            <h1 className="ai-creation-studio__section-title">AVATAR-STUDIO</h1>
                        </div>
                        
                        <div className="ai-creation-studio__content-wrapper">
                            <div className="ai-creation-studio__card ai-creation-studio__card--blue-border">
                                <div className="ai-creation-studio__card-header">
                                    <span className="ai-creation-studio__card-title">Your Vision</span>
                                    <i className="fa-solid fa-comment-dots ai-creation-studio__card-icon"></i>
                                </div>
                                <textarea
                                    className="ai-creation-studio__textarea"
                                    placeholder="Describe the scene, characters, setting and emotions for your video..."
                                    value={promptInput}
                                    onChange={handlePromptChange}
                                ></textarea>
                                <i className="fa-solid fa-lightbulb ai-creation-studio__lightbulb-icon"></i>
                            </div>

                            <div className="ai-creation-studio__card ai-creation-studio__card--magenta-border">
                                <div className="ai-creation-studio__card-header">
                                    <span className="ai-creation-studio__card-title">Visual Inspiration</span>
                                    <i className="fa-solid fa-camera ai-creation-studio__card-icon"></i>
                                </div>
                               <div className="ai-creation-studio__upload-area">
                                    {uploadedImage ? (
                                        <div className="ai-creation-studio__image-preview">
                                            <img 
                                                src={uploadedImage} 
                                                alt="Uploaded preview" 
                                                className="ai-creation-studio__uploaded-image"
                                            />
                                            <button 
                                                className="ai-creation-studio__btn-remove-image"
                                                onClick={() => {
                                                    setUploadedImage(null);
                                                    setUploadedImageFile(null);
                                                    console.log('🗑 Image removed');
                                                }}
                                            >
                                                <i className="fa-solid fa-circle-xmark"></i>
                                            </button>
                                            <p className="ai-creation-studio__file-name">
                                                {uploadedImageFile?.name}
                                            </p>
                                        </div>
                                    ) : (  <>
                                    <i className="fa-solid fa-cloud-arrow-up ai-creation-studio__upload-icon"></i>
                                    <p>Upload style references, character art, or mood boards</p>
                                    <button className="ai-creation-studio__btn-upload" onClick={() => document.getElementById('file-upload').click()}>
                                        Click to browse files
                                    </button>
                                     </>
                                    )}
                                    <input type="file" id="file-upload" style={{ display: 'none' }}  accept="image/*"
                                        onChange={handleImageUpload} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Cast & Converse */}
                    <section id="section-cast-converse" className="ai-creation-studio__section">
                        <div className="ai-creation-studio__section-header">
                            <h1 className="ai-creation-studio__section-title">CAST & CONVERSE</h1>
                        </div>
                        
                        <div className="ai-creation-studio__content-wrapper">
                            <div className="ai-creation-studio__card ai-creation-studio__card--blue-border">
                                <div className="ai-creation-studio__card-header">
                                    <span className="ai-creation-studio__card-title">Dialogue Input</span>
                                    <i className="fa-solid fa-comment-dots ai-creation-studio__card-icon"></i>
                                </div>
                                <div className="ai-creation-studio__dialogue-container">
                                    {dialogueLines.map((line) => (
                                        <div className="ai-creation-studio__dialogue-line" key={line.id}>
                                            <select
                                                className="ai-creation-studio__speaker-dropdown"
                                                value={line.speakerId}
                                                onChange={(e) => handleDialogueSpeakerChange(line.id, e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                {speakers.map(speaker => (
                                                    <option key={speaker.id} value={speaker.id}>{speaker.id}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                className="ai-creation-studio__dialogue-input"
                                                placeholder="Enter dialogue line..."
                                                value={line.text}
                                                onChange={(e) => handleDialogueTextChange(line.id, e.target.value)}
                                            />
                                            <button className="ai-creation-studio__btn-remove-line" onClick={() => removeDialogueLine(line.id)}>
                                                <i className="fa-solid fa-circle-xmark"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button className="ai-creation-studio__btn-add-line" onClick={addDialogueLine}>
                                    <i className="fa-solid fa-plus"></i> Add Dialogue Line
                                </button>
                            </div>

                            <div className="ai-creation-studio__card ai-creation-studio__card--magenta-border">
                                <div className="ai-creation-studio__card-header">
                                    <span className="ai-creation-studio__card-title">Define Speakers</span>
                                    <i className="fa-solid fa-microphone-lines ai-creation-studio__card-icon"></i>
                                </div>
                                <div className="ai-creation-studio__num-speakers-control">
                                    <span className="ai-creation-studio__control-label">Number of Speakers</span>
                                    <div className="ai-creation-studio__speaker-stepper">
                                        <button onClick={decrementNumSpeakers} disabled={numSpeakersInput <= 0}>–</button>
                                        <input
                                            type="number"
                                            className="ai-creation-studio__num-speakers-input"
                                            value={numSpeakersInput}
                                            onChange={handleNumSpeakersInputChange}
                                            min="0" max="10"
                                        />
                                        <button onClick={incrementNumSpeakers} disabled={numSpeakersInput >= 10}>+</button>
                                    </div>
                                </div>
                                <div className="ai-creation-studio__speaker-slots">
                                    {speakers.map((speaker, index) => (
                                        <div className="ai-creation-studio__voice-slot" key={speaker.id}>
                                            <div className="ai-creation-studio__speaker-avatar">
                                                <i className="fa-solid fa-user"></i>
                                            </div>
                                            <span className="ai-creation-studio__speaker-id">{speaker.id}</span>
                                            <select
                                                className="ai-creation-studio__voice-select"
                                                value={speaker.voice}
                                                onChange={(e) => handleSpeakerVoiceChange(speaker.id, e.target.value)}
                                            >
                                                <option value="">Select Voice Personality</option>
                                                {voiceOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.text}
                                                    </option>
                                                ))}
                                            </select>
                                            <button className="ai-creation-studio__btn-remove-speaker" onClick={() => removeSpeaker(index)}>
                                                <i className="fa-solid fa-circle-xmark"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="ai-creation-studio__action-buttons">
                            <button className="ai-creation-studio__btn-secondary">Preview Storyboard</button>
                              
                            {jobStatus === 'completed' ? (
                                <button 
                                    className="ai-creation-studio__btn-primary ai-creation-studio__btn-success"
                                    onClick={downloadVideo}
                                >
                                    <i className="fa-solid fa-download"></i> Download Video
                                </button>
                            ) : (
                                <button 
                                    className="ai-creation-studio__btn-primary" 
                                    onClick={forgeMasterpiece}
                                    disabled={isGenerating || !uploadedImageFile}
                                >
                                    {isGenerating ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin"></i> Generating...
                                        </>
                                    ) : (
                                        'FORGE YOUR MASTERPIECE'
                                    )}
                                </button>
                            )}
                            
                            {jobStatus && (
                                <div className="ai-creation-studio__status">
                                    {jobStatus === 'processing' ? (
                                        <div className="ai-creation-studio__status-processing">
                                            <i className="fa-solid fa-spinner fa-spin"></i> 
                                            Generating video... This may take a few minutes.
                                        </div>
                                    ) : jobStatus === 'completed' ? (
                                        <div className="ai-creation-studio__status-completed">
                                            <i className="fa-solid fa-check"></i> 
                                            Video ready! Scroll down to view.
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Section 3: Generated Video Output */}
                    {jobStatus === 'completed' && generatedVideo && (
                        <section id="section-output" className="ai-creation-studio__section">
                            <div className="ai-creation-studio__section-header">
                                <h1 className="ai-creation-studio__section-title">YOUR MASTERPIECE</h1>
                            </div>
                            
                            <div className="ai-creation-studio__content-wrapper">
                                <div className="ai-creation-studio__card ai-creation-studio__card--gold-border">
                                    <div className="ai-creation-studio__card-header">
                                        <span className="ai-creation-studio__card-title">Generated Video</span>
                                        <i className="fa-solid fa-film ai-creation-studio__card-icon"></i>
                                    </div>
                                    <div className="ai-creation-studio__video-container">
                                        <video 
                                            controls 
                                            autoPlay 
                                            muted 
                                            className="ai-creation-studio__generated-video"
                                            key={jobId}
                                        >
                                            <source src={generatedVideo} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                    <div className="ai-creation-studio__video-actions">
                                        <button 
                                            className="ai-creation-studio__btn-primary" 
                                            onClick={downloadVideo}
                                        >
                                            <i className="fa-solid fa-download"></i> Download Video
                                        </button>
                                        <button 
                                            className="ai-creation-studio__btn-secondary"
                                            onClick={createAnotherVideo}
                                        >
                                            <i className="fa-solid fa-rotate-left"></i> Create Another
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>
            
            {/* Gemini Assistant */}
            <GeminiAssistant 
                onPromptGenerated={handlePromptFromGemini}
                onDialogueGenerated={handleDialogueFromGemini}
                onImageGenerated={handleImageFromGemini}
                currentSpeakers={speakers}
            />
        </div>
    );
}

export default AICreationStudio;