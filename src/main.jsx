import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { useGLTF } from '@react-three/drei';

import App from './App';
import './styles.css';

useGLTF.preload('/tv.glb');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
