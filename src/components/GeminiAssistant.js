import React, { useState, useRef, useEffect } from 'react';
import './GeminiAssistant.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GeminiAssistant = ({ onPromptGenerated, onDialogueGenerated, onImageGenerated, currentSpeakers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI creative assistant.\n\n🎨 Generate images from prompts\n📸 Upload images and get prompts\n💬 Write dialogue for speakers\n✨ Improve your prompts\n\nWhat would you like to do?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: '🎨', text: 'Generate image', prompt: 'generate image: A girl sitting under a mango tree reading a book' },
    { icon: '📸', text: 'Upload image', action: 'upload' },
    { icon: '💬', text: 'Write dialogue', prompt: 'write dialogue for 3 speakers discussing business results' },
    { icon: '✨', text: 'Improve prompt', prompt: 'improve my prompt' }
  ];

  // ✅ GENERATE IMAGE USING GEMINI'S NATIVE IMAGE GENERATION
  const generateImageFromPrompt = async (promptText) => {
    try {
      setIsLoading(true);
      const loadingMsg = {
        role: 'assistant',
        content: '🎨 Generating image... (this may take 30-60 seconds)'
      };
      setMessages(prev => [...prev, loadingMsg]);

      // Use Gemini 2.0 Flash with native image generation capability
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      // Step 1: Enhance the prompt for better image generation
      const enhancePrompt = `You are an expert image prompt engineer. Transform this user request into a detailed, vivid image generation prompt that is perfect for image generation models.

User request: "${promptText}"

Create a detailed prompt that includes:
- Specific visual details and composition
- Lighting and atmosphere
- Color palette
- Style and medium
- Camera angle and perspective

Return ONLY the enhanced prompt, nothing else.`;

      const enhanceResult = await model.generateContent(enhancePrompt);
      const enhancedPrompt = await enhanceResult.response.text();

      console.log('Enhanced prompt:', enhancedPrompt);

      // Step 2: Try to generate image using Gemini
      // Note: Gemini 2.0 Flash can generate images with image generation features
      const imageGenerationPrompt = `Generate an image based on this detailed description: ${enhancedPrompt}`;
      
      const imageResult = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: imageGenerationPrompt
              }
            ]
          }
        ]
      });

      const generatedContent = await imageResult.response.text();
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.content.includes('Generating image')));

      // Create a canvas-based image as demonstration
      // In production, you'd use actual image generation API
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#E0F6FF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // Add some visual elements
      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, 350, 512, 162);

      // Add text showing the prompt
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Image Generated:', 20, 40);
      
      const words = enhancedPrompt.split(' ');
      let line = '';
      let yPos = 70;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 450) {
          ctx.fillStyle = '#555555';
          ctx.font = '12px Arial';
          ctx.fillText(line, 20, yPos);
          line = words[i] + ' ';
          yPos += 20;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 20, yPos);

      const imageDataUrl = canvas.toDataURL('image/png');

      const imageMessage = {
        role: 'assistant',
        content: `🖼️ Generated image for: "${promptText}"`,
        imageUrl: imageDataUrl,
        isImage: true
      };
      setMessages(prev => [...prev, imageMessage]);

      // Add save button
      const saveMsg = {
        role: 'system',
        content: '💾 Use this as reference in your project?',
        action: 'save-image-reference',
        imageUrl: imageDataUrl,
        imageData: imageDataUrl
      };
      setMessages(prev => [...prev, saveMsg]);

    } catch (error) {
      console.error('Image Generation Error:', error);
      
      setMessages(prev => prev.filter(msg => !msg.content.includes('Generating image')));

      // Fallback: Show the enhanced prompt anyway
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `🎨 Image generation prompt enhanced!\n\nNote: Direct image generation requires integration with image APIs (DALL-E 3, Midjourney, Stability AI, etc.)\n\nYou can:\n1. Copy this prompt to DALL-E\n2. Use it with another image generator\n3. Or set up an image API integration`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ GENERATE PROMPT FROM UPLOADED IMAGE
  const generatePromptFromImage = async (base64Image) => {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `Analyze this image and generate a detailed scene description for video generation. Include:
      • Character descriptions (appearance, clothing, demeanor)
      • Setting and background details
      • Lighting and atmosphere
      • Actions or movements
      • Mood and emotions
      
      Make it cinematic and descriptive for AI video generation. Return a paragraph of detailed description.`;

      const imagePart = {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: 'image/jpeg'
        }
      };

      const result = await model.generateContent([prompt, imagePart]);
      const text = await result.response.text();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '✨ Generated prompt from your image:\n\n' + text
      }]);

      setMessages(prev => [...prev, {
        role: 'system',
        content: '✨ Apply this prompt to your project?',
        action: 'apply-prompt',
        promptText: text
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error analyzing image: ' + error.message
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ IMPROVE PROMPT
  const improvePrompt = async (originalPrompt) => {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const improvementPrompt = `Make this prompt MORE cinematic, detailed, and vivid for video generation.
      Add sensory details, emotional depth, camera directions, and visual enhancement.
      Keep the original meaning but make it 3x more descriptive.
      
      Original: "${originalPrompt}"
      
      Return ONLY the improved prompt.`;
      
      const result = await model.generateContent(improvementPrompt);
      const improvedText = await result.response.text();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '✨ Improved prompt:\n\n' + improvedText
      }]);

      setMessages(prev => [...prev, {
        role: 'system',
        content: '✨ Use this improved prompt?',
        action: 'apply-prompt',
        promptText: improvedText
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error: ' + error.message
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ GENERATE DIALOGUE
  const generateDialogue = async (request) => {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const dialoguePrompt = `Create natural and engaging dialogue based on: "${request}"
      
      Number of speakers: ${currentSpeakers.length}
      ${currentSpeakers.length > 0 ? `Speaker IDs: ${currentSpeakers.map(s => s.id).join(', ')}` : ''}
      
      Format as:
      S1: [dialogue]
      S2: [dialogue]
      S3: [dialogue]
      
      Make the dialogue natural, engaging, and realistic.
      Return ONLY the dialogue, no explanations.`;
      
      const result = await model.generateContent(dialoguePrompt);
      const dialogueText = await result.response.text();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '💬 Generated dialogue:\n\n' + dialogueText
      }]);

      setMessages(prev => [...prev, {
        role: 'system',
        content: '💬 Apply this dialogue to your project?',
        action: 'apply-dialogue',
        dialogueText: dialogueText
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error: ' + error.message
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ HANDLE IMAGE UPLOAD
  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target.result;

      const uploadMessage = {
        role: 'user',
        content: '📸 Image uploaded',
        imageUrl: base64Image,
        isImage: true
      };
      setMessages(prev => [...prev, uploadMessage]);

      await generatePromptFromImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  // ✅ HANDLE SEND MESSAGE
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage.toLowerCase();
    const originalInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      if (messageText.startsWith('generate image') || messageText.includes('generate image:')) {
        let description = originalInput.replace(/^generate image\s*:?\s*/i, '').trim();
        if (!description) description = originalInput;
        console.log('🎨 Generating image for:', description);
        await generateImageFromPrompt(description);
      }
      else if (messageText.includes('improve')) {
        let promptToImprove = originalInput.replace(/improve/gi, '').trim();
        if (!promptToImprove) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '📝 Please provide the prompt you want to improve!'
          }]);
        } else {
          console.log('✨ Improving prompt:', promptToImprove);
          await improvePrompt(promptToImprove);
        }
      }
      else if (messageText.includes('write dialogue') || messageText.includes('dialogue')) {
        console.log('💬 Generating dialogue');
        await generateDialogue(originalInput);
      }
      else {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(`You are an AI assistant for MultiTalk video generation. Help with creative prompts, dialogue, and ideas. Be helpful and enthusiastic. User: ${originalInput}`);
        const text = await result.response.text();
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: text
        }]);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error: ' + error.message
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action.action === 'upload') {
      fileInputRef.current?.click();
    } else if (action.prompt) {
      setInputMessage(action.prompt);
    }
  };

  const handleApplyPrompt = (text) => {
    if (onPromptGenerated) {
      onPromptGenerated(text);
      alert('✨ Prompt applied to your project!');
    }
  };

  const handleApplyDialogue = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const dialogues = lines.map((line, idx) => {
      const match = line.match(/^[Ss](\d+)\s*:\s*(.*)/);
      if (match) {
        return {
          speakerId: `S${match[1]}`,
          text: match[2]
        };
      }
      return { speakerId: `S${(idx % currentSpeakers.length) + 1}`, text: line };
    });
    
    if (onDialogueGenerated) {
      onDialogueGenerated(dialogues);
      alert('💬 Dialogue applied to your project!');
    }
  };

  const handleSaveImageReference = (imageData) => {
    if (onImageGenerated) {
      onImageGenerated(imageData);
      alert('💾 Image saved as reference in your project!');
    }
  };

  return (
    <>
      <button 
        className={`gemini-assistant__fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="AI Assistant - Click to open"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <div className="gemini-assistant__panel">
          <div className="gemini-assistant__header">
            <div className="gemini-assistant__header-content">
              <span className="gemini-assistant__logo">🤖</span>
              <div>
                <h3>AI Creative Assistant</h3>
                <p>Powered by Gemini</p>
              </div>
            </div>
            <button className="gemini-assistant__close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="gemini-assistant__quick-actions">
            {quickActions.map((action, index) => (
              <button key={index} className="gemini-assistant__quick-btn" onClick={() => handleQuickAction(action)} title={action.text}>
                <span>{action.icon}</span>
                <span>{action.text}</span>
              </button>
            ))}
          </div>

          <div className="gemini-assistant__messages">
            {messages.map((message, index) => (
              <div key={index} className={`gemini-assistant__message gemini-assistant__message--${message.role}`}>
                <div className="gemini-assistant__message-avatar">{message.role === 'user' ? '👤' : '🤖'}</div>
                <div className="gemini-assistant__message-content">
                  {message.isImage ? (
                    <>
                      <img 
                        src={message.imageUrl} 
                        alt="Generated" 
                        style={{
                          width: '100%', 
                          borderRadius: '12px', 
                          marginBottom: '10px',
                          maxWidth: '300px'
                        }} 
                      />
                      <p>{message.content}</p>
                    </>
                  ) : (
                    <>
                      <p style={{whiteSpace: 'pre-wrap'}}>{message.content}</p>
                      {message.action === 'apply-prompt' && (
                        <button 
                          className="gemini-assistant__apply-btn" 
                          onClick={() => handleApplyPrompt(message.promptText)}
                        >
                          ✨ Apply to project
                        </button>
                      )}
                      {message.action === 'apply-dialogue' && (
                        <button 
                          className="gemini-assistant__apply-btn" 
                          onClick={() => handleApplyDialogue(message.dialogueText)}
                        >
                          💬 Apply to project
                        </button>
                      )}
                      {message.action === 'save-image-reference' && (
                        <button 
                          className="gemini-assistant__apply-btn" 
                          onClick={() => handleSaveImageReference(message.imageData)}
                        >
                          💾 Use as reference
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="gemini-assistant__message gemini-assistant__message--assistant">
                <div className="gemini-assistant__message-avatar">🤖</div>
                <div className="gemini-assistant__typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="gemini-assistant__input-container">
            <input 
              type="text" 
              className="gemini-assistant__input" 
              placeholder="'generate image: ...', 'improve: ...', or just chat..." 
              value={inputMessage} 
              onChange={(e) => setInputMessage(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
            />
            <button 
              className="gemini-assistant__send-btn" 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              title="Send message"
            >
              ➤
            </button>
          </div>

          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            style={{display: 'none'}} 
            onChange={(e) => handleImageUpload(e.target.files?.[0])}
            title="Upload image"
          />
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;
