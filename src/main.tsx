import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './components/material-tailwind.tsx';
import { Toaster } from 'react-hot-toast';

console.log(`VITE_APP_TXT_SINK_API_URL: ${import.meta.env.VITE_APP_TXT_SINK_API_URL}`)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider value={undefined}>
      <Toaster />
      <App children />
    </ThemeProvider>
  </StrictMode>,
);
