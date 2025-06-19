import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Reset browser zoom and scaling on startup
const resetBrowserScaling = () => {
  // Reset document zoom
  if (document.body) {
    document.body.style.zoom = '1';
    document.body.style.transform = 'none';
  }
  
  if (document.documentElement) {
    document.documentElement.style.zoom = '1';
    document.documentElement.style.transform = 'none';
  }
  
  // Set viewport meta tag if not present or incorrect
  let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    document.head.appendChild(viewportMeta);
  }
  viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
};

// Call reset function immediately
resetBrowserScaling();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
