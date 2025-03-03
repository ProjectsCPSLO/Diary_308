import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { PostsContextProvider } from './context/PostsContext';
import { AuthContextProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Your custom ThemeContext
import './styles/index.scss'; // Ensure correct path for styles
// Import Leaflet's CSS so that maps and markers are styled correctly
import 'leaflet/dist/leaflet.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      {' '}
      {/* Custom ThemeProvider, including Material UI ThemeProvider */}
      <AuthContextProvider>
        <PostsContextProvider>
          <Router>
            <div style={{ height: '100%' }}>
              {' '}
              {/* Ensure full height */}
              <App />
            </div>
          </Router>
        </PostsContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
