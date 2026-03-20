import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TokenProvider } from './context/TokenContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TokenProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(20px)',
              color: '#fff',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#06b6d4', secondary: '#020617' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#020617' },
            },
          }}
        />
      </TokenProvider>
    </BrowserRouter>
  </React.StrictMode>
);
