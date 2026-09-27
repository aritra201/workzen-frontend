import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { getGoogleClientId } from './utils/googleClientId.js';
import App from './App.jsx';
import './index.css';

const googleClientId = getGoogleClientId();

function RootProviders({ children }) {
  if (!googleClientId) {
    return children;
  }
  return <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>;
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <RootProviders>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </RootProviders>
  </BrowserRouter>
);
