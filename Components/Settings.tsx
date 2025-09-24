/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import {GoogleGenAI} from '@google/genai';
import React, {useEffect, useState} from 'react';

export function Settings({
  onClose,
  addToast,
}: {
  onClose: () => void;
  addToast: (toast: {
    title: string;
    description?: string;
    severity?: 'success' | 'error' | 'warning' | 'info';
  }) => void;
}) {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('geminiApiKey') || '',
  );
  const [isTesting, setIsTesting] = useState(false);
  const [numberOfCreations, setNumberOfCreations] = useState(() =>
    parseInt(localStorage.getItem('numberOfCreations') || '1', 10),
  );
  const [aspectRatio, setAspectRatio] = useState(
    () => (localStorage.getItem('aspectRatio') as '16:9' | '9:16') || '16:9',
  );
  const [veoModel, setVeoModel] = useState(
    () => localStorage.getItem('veoModel') || 'veo-3.0-fast-generate-001',
  );

  useEffect(() => {
    localStorage.setItem('numberOfCreations', String(numberOfCreations));
  }, [numberOfCreations]);

  useEffect(() => {
    localStorage.setItem('aspectRatio', aspectRatio);
  }, [aspectRatio]);

  useEffect(() => {
    localStorage.setItem('veoModel', veoModel);
  }, [veoModel]);

  const handleSaveApiKey = () => {
    localStorage.setItem('geminiApiKey', apiKey);
    addToast({title: 'API Key saved!', severity: 'success'});
  };

  const handleTestApiKey = async () => {
    setIsTesting(true);
    try {
      if (!apiKey) {
        throw new Error('API Key is not set.');
      }
      const testAi = new GoogleGenAI({apiKey: apiKey});
      await testAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'hello',
      });
      addToast({title: 'API Key is valid!', severity: 'success'});
    } catch (e) {
      addToast({
        title: 'API Key is invalid or call failed.',
        description: e.message,
        severity: 'error',
      });
    }
    setIsTesting(false);
  };

  return (
    <div
      className="settings-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title">
      <div className="settings-content">
        <button
          className="settings-close"
          onClick={onClose}
          aria-label="Close settings">
          &times;
        </button>
        <h2 id="settings-title">Settings</h2>

        <div className="settings-section">
          <h3>API Key</h3>
          <p>
            Enter your Gemini API key below. Your key is stored only in your
            browser.
          </p>
          <div className="api-key-input-group">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API Key"
              className="settings-input"
            />
            <button onClick={handleSaveApiKey}>Save</button>
          </div>
          <button onClick={handleTestApiKey} disabled={isTesting}>
            {isTesting ? 'Testing...' : 'Test API Key'}
          </button>
        </div>

        <div className="settings-section">
          <h3>Creations per Prompt</h3>
          <p>Number of images or videos to generate at once.</p>
          <input
            className="storyboard-input"
            type="number"
            value={numberOfCreations}
            onChange={(e) =>
              setNumberOfCreations(
                Math.max(1, parseInt(e.target.value, 10) || 1),
              )
            }
            min="1"
            max="4"
          />
        </div>

        <div className="settings-section">
          <h3>Aspect Ratio</h3>
          <p>Set the aspect ratio for generated images and videos.</p>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="aspectRatio"
                value="16:9"
                checked={aspectRatio === '16:9'}
                onChange={(e) =>
                  setAspectRatio(e.target.value as '16:9' | '9:16')
                }
              />
              Widescreen (16:9)
            </label>
            <label>
              <input
                type="radio"
                name="aspectRatio"
                value="9:16"
                checked={aspectRatio === '9:16'}
                onChange={(e) =>
                  setAspectRatio(e.target.value as '16:9' | '9:16')
                }
              />
              Portrait (9:16)
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Video Model</h3>
          <p>
            Choose the model for video generation. HQ is higher quality but
            slower.
          </p>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="veoModel"
                value="veo-3.0-fast-generate-001"
                checked={veoModel === 'veo-3.0-fast-generate-001'}
                onChange={(e) => setVeoModel(e.target.value)}
              />
              Fast
            </label>
            <label>
              <input
                type="radio"
                name="veoModel"
                value="veo-3.0-generate-001"
                checked={veoModel === 'veo-3.0-generate-001'}
                onChange={(e) => setVeoModel(e.target.value)}
              />
              High Quality (HQ)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
