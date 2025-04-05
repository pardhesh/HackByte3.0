import React, { useState, useEffect } from 'react';
import './App.css';
import JobSearch from './components/JobSearch';

function App() {
  const [theme, setTheme] = useState('dark-theme');
  
  useEffect(() => {
    // Listen for theme changes from JobSearch component
    const handleThemeChange = () => {
      setTheme(document.body.className);
    };
    
    // Use MutationObserver to detect className changes on body
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`App ${theme}`}>
      <JobSearch />
    </div>
  );
}

export default App; 