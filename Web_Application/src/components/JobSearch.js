import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaSearch, FaFilter, FaSun, FaMoon } from 'react-icons/fa';
import axios from 'axios';
import './JobSearch.css';

// The webhook URL for n8n
const WEBHOOK_URL = 'https://tan7254.app.n8n.cloud/webhook-test/16c70782-dbd1-4428-afac-66d2ed19c4db';

const JobSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mailsSent, setMailsSent] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  // Initialize speech recognition and theme
  useEffect(() => {
    let recognition = null;
    
    // Set initial theme
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
    
    if ('webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        setIsListening(false);
        setError('Speech recognition error: ' + event.error);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isDarkTheme]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.className = !isDarkTheme ? 'dark-theme' : 'light-theme';
  };

  const handleVoiceInput = () => {
    setError(null);
    
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        setIsListening(false);
        setError('Speech recognition error: ' + event.error);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      setError('Speech recognition is not supported in your browser.');
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    setError(null);
    setMailsSent(false);
    
    try {
      console.log('Sending request to n8n webhook...');
      
      // Send request to n8n
      const response = await axios.post(
        WEBHOOK_URL,
        { query: inputValue },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 300000 // 5 minutes timeout
        }
      );
      
      console.log('Response received:', response);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      
      // Handle different response formats
      if (typeof response.data === 'object' && response.data !== null) {
        // It's an object, store as is
        setResult(response.data);
      } else {
        // It's a string or other primitive, store as is
        setResult(response.data);
      }
      
      setMailsSent(true);
    } catch (err) {
      console.error('Error fetching job results:', err);
      setError('Error fetching job results. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`job-search-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDarkTheme ? <FaMoon /> : <FaSun />}
      </button>
      
      <h1>Vibe Apply</h1>
      
      <div className="search-box">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter job title, skills, or keywords..."
            disabled={isLoading}
            className={`${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
          />
          <button 
            className="mic-button" 
            onClick={handleVoiceInput}
            disabled={isLoading || isListening}
            title="Use voice input"
          >
            <FaMicrophone className={isListening ? 'listening' : ''} />
          </button>
          <button 
            className="filter-button" 
            title="Filter options"
          >
            <FaFilter />
          </button>
        </div>
        
        <button 
          className="search-button" 
          onClick={handleSearch}
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? 'Searching...' : 'Search Jobs'}
          {!isLoading && <FaSearch className="search-icon" />}
        </button>
      </div>
      
      {isLoading && (
        <div className={`loading-spinner ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <div className="spinner"></div>
          <h3>Processing Your Request</h3>
          <div className="loading-text">
            Waiting for response from n8n<span className="loading-dots"></span>
          </div>
          <p style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.7 }}>
            This may take a moment as we search for the best job opportunities
          </p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className={`results-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <h2>Job Results</h2>
          {typeof result === 'object' ? (
            <>
              {/* Display the message if it exists */}
              {result.message && <p>{result.message}</p>}
              
              {/* Display the sheet URL as a link if it exists */}
              {result.sheetUrl && (
                <a 
                  href={result.sheetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`job-result-link ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
                >
                  {result.sheetText || "Job List"}
                </a>
              )}
            </>
          ) : (
            // Fallback for when result is a string (old way)
            <a 
              href={result} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`job-result-link ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
            >
              {result}
            </a>
          )}
          
          {mailsSent && (
            <div className="mail-sent-message">
              <p>Cold mails have been sent!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSearch;