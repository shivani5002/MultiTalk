import React, { useState, useEffect } from 'react';
import './AICreationStudio.css';
import Navbar from './Navbar';

// Constants for Voice Options
const voiceOptions = [
    { value: "Crisp Female", text: "Crisp Female" },
    { value: "Deep Male", text: "Deep Male" },
    { value: "Child Play", text: "Child Play" },
    { value: "Robotic", text: "Robotic" }
]; 

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

    const generateVideoJson = () => {
        alert('Video Generation Initiated! Check console for simulated JSON output.');

        const ttsAudio = dialogueLines.reduce((acc, line) => {
            const speakerConfig = speakers.find(s => s.id === line.speakerId);
            const voiceKey = speakerConfig?.voice || 'default_voice';
            const text = line.text;

            acc.text = acc.text ? `${acc.text} ${text}` : text;
            acc[`human${line.speakerId}_voice`] = voiceKey;
            return acc;
        }, { text: '' });

        const finalJSON = {
            "prompt": promptInput || 'A new avatar video.',
            "cond_image": 'user_uploaded_image.png',
            "tts_audio": ttsAudio,
            "cond_audio": {}
        };
        console.log(JSON.stringify(finalJSON, null, 2));
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
                                    <i className="fa-solid fa-cloud-arrow-up ai-creation-studio__upload-icon"></i>
                                    <p>Upload style references, character art, or mood boards</p>
                                    <button className="ai-creation-studio__btn-upload" onClick={() => document.getElementById('file-upload').click()}>
                                        Click to browse files
                                    </button>
                                    <input type="file" id="file-upload" style={{ display: 'none' }} />
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
                            <button className="ai-creation-studio__btn-primary" onClick={generateVideoJson}>FORGE YOUR MASTERPIECE</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default AICreationStudio;
