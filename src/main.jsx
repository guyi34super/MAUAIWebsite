import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const container = document.getElementById('root');

if (!container) {
  document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">App failed to start: #root element not found.</p>';
} else {
  container.replaceChildren();

  createRoot(container).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
