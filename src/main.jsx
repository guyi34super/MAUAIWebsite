import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const container = document.getElementById('root');
// Clear any prerendered crawlable content before React takes over.
container.replaceChildren();

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
