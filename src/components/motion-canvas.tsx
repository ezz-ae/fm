"use client";

import { useRef, useEffect, useCallback, useState } from 'react';
import { AppState, StrokeMetrics } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Point {
  x: number;
  y: number;
  speed: number;
  time: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

const MAX_POINTS = 5000;
const MIN_SPEED_THRESHOLD = 0.1;
const MAX_SPEED_THRESHOLD = 10;
const MIN_STROKE_WIDTH = 2;
const MAX_STROKE_WIDTH = 8;
const PAUSE_TIMEOUT = 1200;
const RELEASE_DURATION = 800;

const MotionCanvas = ({
  appState,
  intensity = 1,
  onDrawStart,
  onPause,
  onReleaseComplete,
  onMetricsCaptured,
  className,
  style
}: {
  appState: AppState;
  intensity?: number;
  onDrawStart: () => void;
  onPause: (canvasDataUrl: string) => void;
  onReleaseComplete: () => void;
  onMetricsCaptured?: (metrics: StrokeMetrics) => void;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPoint = useRef<Point | null>(null);
  const points = useRef<Point[]>([]);
  const particles = useRef<Particle[]>([]);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number>();
  
  const startTime = useRef<number>(0);
  const pauses = useRef<number>(0);
  const speeds = useRef<number[]>([]);

  // Calculate dynamic stroke color based on intensity
  const getStrokeColor = (alpha: number) => {
    if (intensity === 1) return `hsla(60, 93%, 95%, ${alpha})`;
    if (intensity <= 3) return `hsla(${200 + Math.random() * 40}, 80%, 70%, ${alpha})`; // Prismatic Blue
    return `hsla(${Math.random() * 360}, 90%, 80%, ${alpha})`; // Pure Light / Multi-color
  };

  const resetPauseTimeout = useCallback(() => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      if (points.current.length > 5) {
        const duration = Date.now() - startTime.current;
        const avgSpeed = speeds.current.reduce((a,b) => a+b, 0) / speeds.current.length;
        const variance = speeds.current.reduce((a,b) => a + Math.pow(b - avgSpeed, 2), 0) / speeds.current.length;
        
        if (onMetricsCaptured) {
          onMetricsCaptured({
            duration,
            density: points.current.length / (duration / 1000),
            pauseCount: pauses.current,
            velocityVariance: variance,
            pressureEstimate: Math.min(1, avgSpeed / 5)
          });
        }

        const canvas = canvasRef.current;
        if(canvas) onPause(canvas.toDataURL());
      }
    }, PAUSE_TIMEOUT);
  }, [onPause, onMetricsCaptured]);

  const getPointerPosition = useCallback((e: PointerEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);
  
  const addPoint = useCallback((pos: { x: number; y: number }) => {
    const now = Date.now();
    const timeDelta = now - (lastPoint.current?.time || now);
    
    let speed = 0;
    if (lastPoint.current && timeDelta > 0) {
      const dx = pos.x - lastPoint.current.x;
      const dy = pos.y - lastPoint.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      speed = distance / timeDelta;
      speeds.current.push(speed);
    }
    
    const newPoint = { ...pos, speed, time: now };
    points.current.push(newPoint);
    
    if (points.current.length > 2) {
        const p1 = points.current[points.current.length - 3];
        const p2 = points.current[points.current.length - 2];
        const p3 = points.current[points.current.length - 1];
        const angle = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p2.y - p1.y, p2.x - p1.x);
        
        if ((Math.abs(angle) > Math.PI / 4 && speed > 1) || speed > 5) {
            const count = Math.ceil(3 * intensity);
            for (let i = 0; i < count; i++) {
                particles.current.push({
                    x: p2.x, y: p2.y,
                    vx: (Math.random() - 0.5) * speed * 0.3 * intensity,
                    vy: (Math.random() - 0.5) * speed * 0.3 * intensity,
                    alpha: 0.8,
                    size: (Math.random() * 2 + 0.5) * intensity,
                    color: getStrokeColor(0.8)
                });
            }
        }
    }

    if (points.current.length > MAX_POINTS) {
      points.current.shift();
    }
    lastPoint.current = newPoint;
  }, [intensity]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (appState === AppState.DRAWING) {
      if (points.current.length === 0) startTime.current = Date.now();
      e.currentTarget?.setPointerCapture(e.pointerId);
      addPoint(getPointerPosition(e));
      resetPauseTimeout();
    }
  }, [appState, addPoint, getPointerPosition, resetPauseTimeout]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const pos = getPointerPosition(e);

    if (appState === AppState.IDLE) {
      if (Math.abs(e.movementX) > 5 || Math.abs(e.movementY) > 5) {
        onDrawStart();
        addPoint(pos);
      }
      return;
    }

    if (appState === AppState.DRAWING) {
      resetPauseTimeout();
      addPoint(pos);
    }
  }, [appState, onDrawStart, addPoint, getPointerPosition, resetPauseTimeout]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (appState === AppState.DRAWING) {
      pauses.current++;
      e.currentTarget?.releasePointerCapture(e.pointerId);
      resetPauseTimeout(); 
    }
  }, [appState, resetPauseTimeout]);
  
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particles.current = particles.current.filter(p => p.alpha > 0);
    particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02 / Math.sqrt(intensity);
        p.vx *= 0.96;
        p.vy *= 0.96;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw strokes
    if (points.current.length < 2) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(points.current[0].x, points.current[0].y);

    for (let i = 1; i < points.current.length; i++) {
      const p1 = points.current[i - 1];
      const p2 = points.current[i];
      
      const speed = p1.speed;
      const baseWidth = Math.max(MIN_STROKE_WIDTH, MAX_STROKE_WIDTH - ((speed - MIN_SPEED_THRESHOLD) / (MAX_SPEED_THRESHOLD - MIN_SPEED_THRESHOLD)) * (MAX_STROKE_WIDTH - MIN_STROKE_WIDTH));
      const width = baseWidth * intensity;
      
      ctx.lineWidth = width;
      
      if (intensity >= 3) {
          ctx.shadowBlur = intensity * 4;
          ctx.shadowColor = `hsla(60, 93%, 95%, 0.3)`;
      } else {
          ctx.shadowBlur = 0;
      }

      const alpha = (0.7 + Math.random() * 0.2);
      ctx.strokeStyle = getStrokeColor(alpha);

      const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      
      if (i % 2 === 0) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(midPoint.x, midPoint.y);
      }
    }
    ctx.stroke();
  }, [intensity]);

  const releaseAnimation = useCallback((startTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / RELEASE_DURATION, 1);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1 - (0.4 * progress); 
    ctx.filter = `blur(${progress * 2 * intensity}px) brightness(${1 + progress * intensity})`;
    
    draw(); 

    ctx.globalAlpha = 1;
    ctx.filter = 'none';

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(() => releaseAnimation(startTime));
    } else {
      onReleaseComplete();
    }
  }, [draw, onReleaseComplete, intensity]);

  useEffect(() => {
    if (appState === AppState.DRAWING) {
      const animate = () => {
        draw();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else if (appState === AppState.RELEASE) {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(() => releaseAnimation(Date.now()));
    } else if (appState === AppState.RESET) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0,0, canvas.width, canvas.height);
      }
      points.current = [];
      particles.current = [];
      lastPoint.current = null;
      speeds.current = [];
      pauses.current = 0;
    }
    
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [appState, draw, releaseAnimation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx?.scale(dpr, dpr);
      draw();
    };

    updateSize();

    window.addEventListener('resize', updateSize);
    window.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [draw, appState, handlePointerMove, handlePointerDown, handlePointerUp]); 
  
  useEffect(() => {
    document.body.style.cursor = appState === AppState.IDLE ? 'auto' : 'none';
  }, [appState]);

  return (
    <canvas ref={canvasRef} className={cn("w-full h-full touch-none", className)} style={style} />
  );
};

export default MotionCanvas;
