import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { endGame, updateMetrics } from '../store/gameSlice';
import { Bubble } from '../types';

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();
  const { config, metrics, isPlaying } = useSelector((state: RootState) => state.game);
  
  const bubblesRef = useRef<Bubble[]>([]);
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number>();
  const lastMetricsUpdateRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const speedMultiplierRef = useRef<number>(1.0);
  
  // Add refs to track current metrics without causing re-renders
  const metricsRef = useRef(metrics);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  
  // Update metrics ref whenever metrics change
  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  // Audio refs
  const audioRefs = useRef({
    bubble: new Audio(`${process.env.PUBLIC_URL}/audio/bubble.mp3`),
    error: new Audio(`${process.env.PUBLIC_URL}/audio/error.mp3`),
    error2: new Audio(`${process.env.PUBLIC_URL}/audio/error2.mp3`),
    piano: new Audio(`${process.env.PUBLIC_URL}/audio/piano.mp3`),
    cc: new Audio(`${process.env.PUBLIC_URL}/audio/cc.mp3`),
  });

  // Initialize piano audio for continuous play
  useEffect(() => {
    const piano = audioRefs.current.piano;
    piano.loop = true;
    piano.volume = 0.3;
  }, []);

  const colors = [
    'rgba(255, 0, 0, ALPHA)',      // Red
    'rgba(255, 127, 0, ALPHA)',    // Orange
    'rgba(255, 255, 0, ALPHA)',    // Yellow
    'rgba(0, 255, 0, ALPHA)',      // Green
    'rgba(0, 0, 255, ALPHA)',      // Blue
    'rgba(75, 0, 130, ALPHA)',     // Indigo
    'rgba(148, 0, 211, ALPHA)',    // Violet
  ];

  const createBubble = useCallback((isTarget: boolean): Bubble => {
    const canvas = canvasRef.current!;
    // Increased margins to avoid UI elements - top: 80px, bottom: 100px, sides: 60px
    const marginTop = 80;
    const marginBottom = 100;
    const marginSide = 60;
    const r = Math.random() * 32 + 28;
    const x = Math.random() * (canvas.clientWidth - 2 * marginSide) + marginSide;
    const y = Math.random() * (canvas.clientHeight - marginTop - marginBottom) + marginTop;
    
    const decoyIcons = ['🐝', '🌞', '🌟', '🍀', '🐾', '🐦', '✨', '🌈', '⭐', '🐬', '🦋', '🌻'];
    const decoyNames = ['Sun', 'Sky', 'Joy', 'Bee', 'Kit', 'Pip', 'Zee', 'Mio'];
    
    const text = isTarget ? config.playerName : decoyNames[Math.floor(Math.random() * decoyNames.length)];
    const icon = isTarget ? config.icon.split(' ')[0] : decoyIcons[Math.floor(Math.random() * decoyIcons.length)];
    
    return {
      id: Math.random().toString(36),
      x,
      y,
      r,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.04,
      text,
      icon,
      isTarget,
      birth: Date.now(),
      alpha: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }, [config.playerName, config.icon]);

  const updateBubble = (bubble: Bubble, dt: number) => {
    const canvas = canvasRef.current!;
    
    // Apply speed multiplier to movement (like original)
    bubble.x += bubble.vx * dt * speedMultiplierRef.current;
    bubble.y += bubble.vy * dt * speedMultiplierRef.current;

    // Add slight random movement (like original)
    bubble.vx += Math.sin(Date.now()) * 0.001 - 0.001;

    // Updated bounce boundaries to respect UI areas
    const marginTop = 80;
    const marginBottom = 100;
    const marginSide = 60;

    // Bounce off walls with proper margins
    if (bubble.x - bubble.r < marginSide) {
      bubble.x = marginSide + bubble.r;
      bubble.vx = Math.abs(bubble.vx);
    }
    if (bubble.x + bubble.r > canvas.clientWidth - marginSide) {
      bubble.x = canvas.clientWidth - marginSide - bubble.r;
      bubble.vx = -Math.abs(bubble.vx);
    }
    if (bubble.y - bubble.r < marginTop) {
      bubble.y = marginTop + bubble.r;
      bubble.vy = Math.abs(bubble.vy);
    }
    if (bubble.y + bubble.r > canvas.clientHeight - marginBottom) {
      bubble.y = canvas.clientHeight - marginBottom - bubble.r;
      bubble.vy = -Math.abs(bubble.vy);
    }

    // Update alpha based on age
    const age = Date.now() - bubble.birth;
    bubble.alpha = Math.min(age / 400, 1);
  };

  const drawBubble = (ctx: CanvasRenderingContext2D, bubble: Bubble) => {
    const baseColor = bubble.color.replace('ALPHA', (bubble.alpha * 0.8).toString());
    const gradient = ctx.createRadialGradient(
      bubble.x - bubble.r * 0.4,
      bubble.y - bubble.r * 0.4,
      bubble.r * 0.2,
      bubble.x,
      bubble.y,
      bubble.r
    );
    
    gradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.alpha * 0.9})`);
    gradient.addColorStop(0.5, baseColor);
    gradient.addColorStop(1, `rgba(135, 206, 235, ${bubble.alpha * 0.2})`);

    ctx.save();
    ctx.globalAlpha = bubble.alpha;

    // Draw bubble
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(180, 220, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw highlight
    ctx.beginPath();
    ctx.ellipse(
      bubble.x - bubble.r * 0.35,
      bubble.y - bubble.r * 0.35,
      bubble.r * 0.4,
      bubble.r * 0.2,
      -0.6,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();

    // Draw icon and text
    ctx.fillStyle = '#08324a';
    ctx.font = `bold ${Math.max(16, bubble.r * 0.5)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bubble.icon, bubble.x, bubble.y - bubble.r * 0.1);

    ctx.font = `600 ${Math.max(12, bubble.r * 0.25)}px system-ui`;
    ctx.fillText(bubble.text, bubble.x, bubble.y + bubble.r * 0.3);

    ctx.restore();
  };

  const playAudio = (audioType: keyof typeof audioRefs.current) => {
    try {
      const audio = audioRefs.current[audioType];
      audio.currentTime = 0;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  const stopAudio = (audioType: keyof typeof audioRefs.current) => {
    try {
      const audio = audioRefs.current[audioType];
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      console.warn('Audio stop failed:', error);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Track total taps (like HTML version) - use current metrics
    dispatch(updateMetrics({
      taps: metricsRef.current.taps + 1,
    }));

    let clickedBubble: Bubble | null = null;
    let clickedIndex = -1;

    // Find clicked bubble (iterate backwards like original)
    for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
      const bubble = bubblesRef.current[i];
      const dx = x - bubble.x;
      const dy = y - bubble.y;
      if (Math.sqrt(dx * dx + dy * dy) <= bubble.r) {
        clickedBubble = bubble;
        clickedIndex = i;
        break;
      }
    }

    if (clickedBubble) {
      const reactionTime = Date.now() - clickedBubble.birth;
      const currentMetrics = metricsRef.current;
      
      if (clickedBubble.isTarget) {
        playAudio('bubble');
        dispatch(updateMetrics({
          hits: currentMetrics.hits + 1,
          streak: currentMetrics.streak + 1,
          bestStreak: Math.max(currentMetrics.bestStreak, currentMetrics.streak + 1),
          reactionTimes: [...currentMetrics.reactionTimes, reactionTime],
        }));
      } else {
        playAudio(Math.random() > 0.5 ? 'error' : 'error2');
        dispatch(updateMetrics({
          misses: currentMetrics.misses + 1,
          streak: 0,
        }));
      }

      // Remove clicked bubble
      bubblesRef.current.splice(clickedIndex, 1);
      
      // Add new bubble after delay (like original)
      setTimeout(() => {
        if (isPlaying) {
          const hasTarget = bubblesRef.current.some(b => b.isTarget);
          const isTarget = hasTarget ? Math.random() > 0.5 : true;
          bubblesRef.current.push(createBubble(isTarget));
          
          // Track target spawns here instead
          if (isTarget) {
            dispatch(updateMetrics({
              targetSpawns: metricsRef.current.targetSpawns + 1,
            }));
          }
        }
      }, 200);
    } else {
      // Missed click
      playAudio(Math.random() > 0.5 ? 'error' : 'error2');
      dispatch(updateMetrics({
        misses: metricsRef.current.misses + 1,
        streak: 0,
      }));
    }
  };

  const gameLoop = useCallback(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const now = Date.now();
    const dt = now - lastTimeRef.current;
    lastTimeRef.current = now;

    const elapsed = now - startTimeRef.current;
    const remaining = Math.max(0, config.gameTime * 1000 - elapsed);
    
    // Update timer display
    setTimeRemaining(Math.ceil(remaining / 1000));

    if (remaining <= 0) {
      stopAudio('piano');
      dispatch(endGame());
      return;
    }

    // Update speed multiplier gradually (like original but more pronounced)
    const progress = elapsed / (config.gameTime * 1000);
    speedMultiplierRef.current = 1.0 + (progress * 3.0); // Speed increases from 1x to 4x

    // Filter out old bubbles (2 second lifespan like original)
    bubblesRef.current = bubblesRef.current.filter(b => now - b.birth < 2000);

    // Ensure we have target bubbles
    const hasTarget = bubblesRef.current.some(b => b.isTarget);

    // Spawn bubbles to maintain count (like original)
    let newTargetSpawns = 0;
    while (bubblesRef.current.length < config.bubbleCount) {
      const isTarget = hasTarget ? Math.random() > 0.5 : true;
      bubblesRef.current.push(createBubble(isTarget));
      if (isTarget) {
        newTargetSpawns++;
      }
    }

    // Update target spawns if any new targets were created
    if (newTargetSpawns > 0) {
      dispatch(updateMetrics({
        targetSpawns: metricsRef.current.targetSpawns + newTargetSpawns,
      }));
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Update and draw all bubbles
    bubblesRef.current.forEach(bubble => {
      updateBubble(bubble, dt);
      drawBubble(ctx, bubble);
    });

    // Update metrics periodically - FIXED CALCULATIONS using refs
    if (now - lastMetricsUpdateRef.current > 100) {
      const currentMetrics = metricsRef.current;
      
      // Fix accuracy calculation to match HTML version exactly
      const accuracy = currentMetrics.taps > 0 ? (currentMetrics.hits / Math.max(1, currentMetrics.taps)) * 100 : 0;
      const avgRT = currentMetrics.reactionTimes.length > 0 ? currentMetrics.reactionTimes.reduce((a, b) => a + b, 0) / currentMetrics.reactionTimes.length : 0;
      // Fix targets per minute calculation to match HTML version exactly
      const tpm = elapsed > 0 ? (currentMetrics.targetSpawns / Math.max(1, elapsed)) * 60000 : 0;

      dispatch(updateMetrics({
        accuracy,
        avgReactionTime: avgRT,
        targetsPerMinute: isFinite(tpm) ? tpm : 0,
      }));
      
      lastMetricsUpdateRef.current = now;
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, config.gameTime, config.bubbleCount, dispatch, createBubble]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now();
      lastTimeRef.current = Date.now();
      lastMetricsUpdateRef.current = 0;
      speedMultiplierRef.current = 1.0;
      bubblesRef.current = [];
      
      // Initial spawn
      let initialTargetSpawns = 0;
      for (let i = 0; i < config.bubbleCount; i++) {
        const isTarget = i < Math.ceil(config.bubbleCount * 0.4);
        bubblesRef.current.push(createBubble(isTarget));
        if (isTarget) {
          initialTargetSpawns++;
        }
      }
      
      // Update initial target spawns
      if (initialTargetSpawns > 0) {
        dispatch(updateMetrics({
          targetSpawns: initialTargetSpawns,
        }));
      }
      
      playAudio('cc');
      setTimeout(() => {
        playAudio('piano');
      }, 500);
      
      gameLoop();
    } else {
      stopAudio('piano');
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopAudio('piano');
    };
  }, [isPlaying, gameLoop, config.bubbleCount, createBubble]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const resizeCanvas = () => {
      // Get the actual viewport dimensions
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || window.innerWidth;
      canvas.height = rect.height || window.innerHeight;
    };

    // Use a small delay to ensure the canvas is properly mounted
    const timeoutId = setTimeout(resizeCanvas, 10);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="fixed inset-0 cursor-pointer bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        style={{ 
          touchAction: 'none',
          width: '100vw',
          height: '100vh'
        }}
      />
      
      {/* Game Timer - moved to top right corner */}
      {isPlaying && (
        <div className="fixed top-1 right-1/2 transform translate-x-1/2 z-20 pointer-events-none">
          <div className={`
            bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-2xl border-2
            ${timeRemaining <= 10 ? 'border-red-500 animate-pulse' : 'border-blue-500'}
          `}>
            <div className="text-center">
              <div className={`
                text-2xl font-bold tabular-nums
                ${timeRemaining <= 10 ? 'text-red-600' : 'text-blue-600'}
              `}>
                {timeRemaining}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                seconds left
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameCanvas;