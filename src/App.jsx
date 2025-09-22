import React, { useState } from 'react';
import WaveGrid from './WaveGrid';
import './App.css';
import logo from './assets/react.svg';

// Simple SVG icons for the button
const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="currentColor"/>
  </svg>
);


function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(100); // A value from 1 to 140

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (event) => {
    setSpeed(Number(event.target.value));
  };

  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="logo" className="app-logo"/>
        <h1>Waveform Visualizer</h1>
      </header>

      <main className="main-content">
        <div className="visualizer-container">
          <WaveGrid isPlaying={isPlaying} speed={speed} />
        </div>

        <div className="controls">
          <button onClick={togglePlay} className="control-button">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="slider-container">
            <label htmlFor="speed">Speed</label>
            <input
              type="range"
              id="speed"
              name="speed"
              min="1"
              max="140"
              value={speed}
              onChange={handleSpeedChange}
              className="speed-slider"
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Status: <span className="status-ok">SYSTEMS NOMINAL</span></p>
      </footer>
    </div>
  )
}

export default App;