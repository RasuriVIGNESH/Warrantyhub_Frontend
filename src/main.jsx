import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize theme based on localStorage or system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
};

// Initialize theme
initializeTheme();

const rootElement = document.getElementById('root');

// Render the main App with error handling
try {
  ReactDOM.createRoot(rootElement).render(
    <React.Fragment>
      <App />
    </React.Fragment>
  );
  console.log('React app mounted successfully');
} catch (error) {
  console.error('Error rendering React app:', error);
  // Fallback content if React fails to render
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2 style="color: #e53e3e;">Error Loading Application</h2>
        <p>There was a problem loading the application. Please check the console for more details.</p>
      </div>
    `;
  }
}


