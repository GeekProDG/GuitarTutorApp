import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Debugging helper for white screen
window.onerror = function (message, source, lineno, colno, error) {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '10px';
  div.style.left = '10px';
  div.style.right = '10px';
  div.style.padding = '20px';
  div.style.background = '#991b1b';
  div.style.color = 'white';
  div.style.zIndex = '99999';
  div.style.borderRadius = '8px';
  div.style.fontFamily = 'monospace';
  div.innerHTML = `<strong>Runtime Error:</strong><br>${message}<br><small>${source}:${lineno}</small>`;
  document.body.appendChild(div);
  return false;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
