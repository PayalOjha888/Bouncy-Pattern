import React, { useState, useEffect, useRef } from 'react';

// --- Configuration ---
const ROWS = 15;
const COLS = 20;
const WAVE_WIDTH = 3;

// --- Color Palettes ---
const palettes = [
  '0, 255, 0',    // Green
  '0, 255, 255',  // Cyan
  '0, 0, 255',    // Blue
  '128, 0, 128',  // Purple
  '255, 0, 0',    // Red
];

const WaveGrid = ({ isPlaying, speed }) => {
  const [grid, setGrid] = useState([]);
  
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const wavePositionRef = useRef(0);
  const directionRef = useRef(1);
  const colorIndexRef = useRef(0);
  const bouncesRef = useRef(0);
  
  // Use a ref to hold the latest prop values to be accessible inside the animation loop
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const [animationTick, setAnimationTick] = useState(0);

  const animate = (time) => {
    // The animation loop always runs, but the logic inside only executes if isPlaying is true.
    if (isPlayingRef.current) {
      const animationDelay = 150 - speedRef.current; // Map speed (1-140) to delay (149ms - 10ms)
      
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        if (deltaTime > animationDelay) {
          previousTimeRef.current = time;
          
          wavePositionRef.current += directionRef.current;

          if (wavePositionRef.current >= COLS - 1 || wavePositionRef.current <= 0) {
            directionRef.current *= -1;
            bouncesRef.current += 1;
            if (bouncesRef.current > 0 && bouncesRef.current % 2 === 0) {
              colorIndexRef.current = (colorIndexRef.current + 1) % palettes.length;
            }
          }
          setAnimationTick(tick => tick + 1);
        }
      } else {
        previousTimeRef.current = time; // Set start time on first play
      }
    } else {
        // If paused, reset the previousTimeRef. This prevents a large jump when unpausing.
        previousTimeRef.current = undefined;
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    const newGrid = [];
    const currentColor = palettes[colorIndexRef.current];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        const distance = Math.abs(c - wavePositionRef.current);
        let opacity = 0;
        if (distance < WAVE_WIDTH) {
          opacity = 1 - (distance / WAVE_WIDTH);
        }
        const color = `rgba(${currentColor}, ${opacity})`;
        row.push({ key: `${r}-${c}`, color });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  }, [animationTick]);

  return (
    <div className="grid-container">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map(cell => (
            <div
              key={cell.key}
              className="grid-cell"
              style={{ backgroundColor: cell.color }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default WaveGrid;