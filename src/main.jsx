import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RoutesApp from './routes';
import "./input.css";
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <AuthProvider>
        <RoutesApp />
      </AuthProvider>
    </>
  </StrictMode>
);