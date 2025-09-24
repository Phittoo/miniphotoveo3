/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import {GoogleGenAI, Type} from '@google/genai';
import React, {useState} from 'react';

export function StoryboardGenerator({
  onClose,
  onSubmit,
  addToast,
}: {
  onClose: () => void;
  onSubmit: (prompts: string[]) => void;
  addToast: (toast: {
    title: string;
    description?: string;
    severity?: 'success' | 'error' | 'warning' | 'info';
  }) => void;
}) {
  const [storyIdea, setStoryIdea] = useState('');
  const [sceneCount, setSceneCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!storyIdea || sceneCount < 1) {
      addToast({
        title: 'Please provide a story idea and a valid number of scenes.',
        severity: 'warning',
      });
      return;
    }

    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
      addToast({
        title: 'API Key not found',
        description: 'Please add your API key in the settings.',
        severity: 'error',
      });
      return;
    }

    setIsGenerating(true);
    const ai = new GoogleGenAI({apiKey});

    const keywords = `
- Camera Angle: wide shot, close-up, medium shot, dolly shot, POV shot.
- Lighting: golden hour, cinematic lighting, soft light, harsh sunlight, neon glow.
- Movement/Transition: slowly pans left/right, zooms in/out, a quick cut to, seamless continuation, match cut, cut to, the character exits frame left/right.
- Emotion: sad, joyful, pensive, anxious, determined.
`;

    const systemInstruction = `You are a creative assistant for a film director. Your task is to generate a storyboard as a sequence of prompts for a video generation model.
The user wants a story about: "${storyIdea}".
Generate a sequence of ${sceneCount} video prompts.
Each prompt must describe an 8-second video clip.
The prompts must connect logically to tell a coherent story.

Follow this exact structure for each prompt:
[Camera Angle] of [Character] doing [Action], in [Setting]. [Lighting] and [Emotion]. [Transition Keyword].

Use a variety of keywords from the following lists:
${keywords}

The final output should be a JSON array of strings, where each string is a complete prompt for one scene. Do not include any other text or explanations.
`;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate the storyboard.',
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      });

      const jsonStr = response.text.trim();
      const prompts = JSON.parse(jsonStr);
      onSubmit(prompts);
    } catch (e) {
      addToast({
        title: 'Failed to generate storyboard.',
        description: e.message,
        severity: 'error',
      });
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="settings-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="storyboard-title">
      <div className="settings-content">
        <button
          className="settings-close"
          onClick={onClose}
          aria-label="Close storyboard generator">
          &times;
        </button>
        <h2 id="storyboard-title">Storyboard Generator</h2>

        <div className="settings-section">
          <h3>Story Idea</h3>
          <p>
            Describe the main character, setting, and plot of your story.
          </p>
          <textarea
            className="storyboard-textarea"
            placeholder="e.g., A detective in a black trench coat investigating a mystery in a misty, noir-style city."
            value={storyIdea}
            onChange={(e) => setStoryIdea(e.target.value)}
            disabled={isGenerating}
            rows={4}
          />
        </div>

        <div className="settings-section">
          <h3>Number of Scenes</h3>
          <p>How many 8-second video clips should be in the story?</p>
          <input
            className="storyboard-input"
            type="number"
            value={sceneCount}
            onChange={(e) => setSceneCount(parseInt(e.target.value, 10))}
            min="1"
            max="10"
            disabled={isGenerating}
          />
        </div>

        <div className="storyboard-actions">
          <button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Storyboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
