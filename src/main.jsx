// src/main.tsx or index.tsx

import { StrictMode } from 'react';
import { ThemeProvider } from './theme/ThemeProvider'
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HeroUIProvider } from '@heroui/react';
import './styles/globals.css'
import { BrowserRouter } from 'react-router-dom';


const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    //<ThemeProvider>
      <StrictMode>
        <BrowserRouter>
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
        </BrowserRouter>
      </StrictMode>
   // </ThemeProvider>
  );
}
