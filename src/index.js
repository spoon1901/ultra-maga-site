import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';  // ✅ This line is the magic

import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
