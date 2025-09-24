/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, {useState} from 'react';

function ExternalLinkIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        marginLeft: '4px',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
}

export function NoticeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="notice-banner">
      To use generative features, please add your own Gemini API key in the
      settings. Get your key from&nbsp;
      <a
        href="https://ai.google.dev/gemini-api/docs/api-key"
        target="_blank"
        rel="noopener noreferrer">
        Google AI Studio
        <ExternalLinkIcon />
      </a>
      .&nbsp;
      <button
        className="notice-bar-close"
        onClick={() => setIsVisible(false)}
        aria-label="Close notice">
        &times;
      </button>
    </div>
  );
}
