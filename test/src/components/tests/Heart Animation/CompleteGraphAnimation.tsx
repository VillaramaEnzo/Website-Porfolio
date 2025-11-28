import React, { useEffect, useRef } from 'react';

// Constants and Configuration
const TWO_PI = Math.PI * 2;

const SHAPES = ['circle', 'heart', 'triangle', 'pentagon', 'star', 'square', 'tripleHeart']; 
//const SHAPES = ['text', 'text'];

// Need to fix the text shape to display the specified text

const GRAPH_CONFIG: GraphConfig = {
  scale: 1,
  pointDensity: 0.02,
  transitionDuration: 2000,
  shapeChangeInterval: 5000,
  isRandomTransition: false,
  backgroundColor: 'rgba(0, 0, 0, 0)',
  fadeAlpha: 0.2,
  textContent: 'Test Text Display',
  fontSize: 72,
  isChaoticTransition: true,
  chaoticIntensity: 0.05,
};

const ANIMATION_CONFIG = {
  particleCount: 200,
  particleSize: { min: 1, max: 2 },
  speed: { min: 1, max: 2 },
  friction: { min: 0.7, max: 0.9 },
  colorRange: {
    hue: { min: 160, max: 240 },
    saturation: { min: 60, max: 100 },
    brightness: { min: 20, max: 80 },
    alpha: 0.1
  },
  fadeSpeed: 0.2
};

// Interface definitions
interface Point {
  x: number;
  y: number;
}

interface Particle {
  position: Point;
  velocity: Point;
  radius: number;
  speed: number;
  targetPointIndex: number;
  direction: number;
  friction: number;
  color: string;
}

interface GraphConfig {
  scale: number;
  pointDensity: number;
  transitionDuration: number;
  shapeChangeInterval: number;
  isRandomTransition: boolean;
  backgroundColor: string;
  fadeAlpha: number;
  textContent: string;
  fontSize: number;
  isChaoticTransition: boolean;
  chaoticIntensity: number;
}

function generateShapePoints(
  shapeName: string,
  width: number,
  height: number,
  config: GraphConfig
): Point[] {
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.2;
  const points: Point[] = [];
  const TWO_PI = Math.PI * 2;
  
  // Ensure minimum number of points for smooth transitions
  const MIN_POINTS = 100; // Baseline for smooth transitions

  switch (shapeName) {
    case 'triangle': {
      // Generate base triangle points
      const basePoints = [];
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * TWO_PI - Math.PI / 2;
        basePoints.push({
          x: centerX + Math.cos(angle) * baseRadius * config.scale,
          y: centerY + Math.sin(angle) * baseRadius * config.scale
        });
      }

      // Distribute points evenly along the triangle edges
      const pointsPerSide = Math.floor(MIN_POINTS / 3);
      for (let i = 0; i < 3; i++) {
        const start = basePoints[i];
        const end = basePoints[(i + 1) % 3];
        for (let j = 0; j < pointsPerSide; j++) {
          const t = j / pointsPerSide;
          points.push({
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t
          });
        }
      }
      break;
    }

    case 'pentagon': {
      // Generate base pentagon points
      const basePoints = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * TWO_PI - Math.PI / 2;
        basePoints.push({
          x: centerX + Math.cos(angle) * baseRadius * config.scale,
          y: centerY + Math.sin(angle) * baseRadius * config.scale
        });
      }

      // Distribute points evenly along the pentagon edges
      const pointsPerSide = Math.floor(MIN_POINTS / 5);
      for (let i = 0; i < 5; i++) {
        const start = basePoints[i];
        const end = basePoints[(i + 1) % 5];
        for (let j = 0; j < pointsPerSide; j++) {
          const t = j / pointsPerSide;
          points.push({
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t
          });
        }
      }
      break;
    }

    case 'heart': {
      // Generate heart shape with consistent point count
      const totalPoints = MIN_POINTS;
      for (let i = 0; i < totalPoints; i++) {
        const t = (i / totalPoints) * TWO_PI;
        const scale = baseRadius * config.scale * 0.08;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        points.push({
          x: centerX + x * scale,
          y: centerY - y * scale
        });
      }
      break;
    }

    case 'circle': {
      // Generate circle with consistent point count
      const totalPoints = MIN_POINTS;
      for (let i = 0; i < totalPoints; i++) {
        const angle = (i / totalPoints) * TWO_PI;
        points.push({
          x: centerX + Math.cos(angle) * baseRadius * config.scale,
          y: centerY + Math.sin(angle) * baseRadius * config.scale
        });
      }
      break;
    }

    case 'star': {
      // Generate base star points
      const starPoints = 5;
      const innerRadius = baseRadius * 0.4;
      const outerRadius = baseRadius;
      const basePoints = [];
      
      for (let i = 0; i < starPoints * 2; i++) {
        const angle = (i * TWO_PI) / (starPoints * 2) - Math.PI / 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        basePoints.push({
          x: centerX + Math.cos(angle) * radius * config.scale,
          y: centerY + Math.sin(angle) * radius * config.scale
        });
      }

      // Distribute points evenly along the star edges
      const pointsPerSide = Math.floor(MIN_POINTS / (starPoints * 2));
      for (let i = 0; i < starPoints * 2; i++) {
        const start = basePoints[i];
        const end = basePoints[(i + 1) % (starPoints * 2)];
        for (let j = 0; j < pointsPerSide; j++) {
          const t = j / pointsPerSide;
          points.push({
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t
          });
        }
      }
      break;
    }

    case 'square': {
      // Generate base square points
      const basePoints = [];
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * TWO_PI - Math.PI / 4; // Rotate by 45 degrees to sit flat
        basePoints.push({
          x: centerX + Math.cos(angle) * baseRadius * config.scale,
          y: centerY + Math.sin(angle) * baseRadius * config.scale
        });
      }

      // Distribute points evenly along the square edges
      const pointsPerSide = Math.floor(MIN_POINTS / 4);
      for (let i = 0; i < 4; i++) {
        const start = basePoints[i];
        const end = basePoints[(i + 1) % 4];
        for (let j = 0; j < pointsPerSide; j++) {
          const t = j / pointsPerSide;
          points.push({
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t
          });
        }
      }
      break;
    }

    case 'tripleHeart': {
      const totalPoints = MIN_POINTS;
      const scales = [1, 0.7, 0.4]; // Three different sizes for nested hearts
      
      scales.forEach(scale => {
        const heartScale = baseRadius * config.scale * 0.08 * scale;
        const pointsPerHeart = Math.floor(totalPoints / 3);
        
        for (let i = 0; i < pointsPerHeart; i++) {
          const t = (i / pointsPerHeart) * TWO_PI;
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
          points.push({
            x: centerX + x * heartScale,
            y: centerY - y * heartScale
          });
        }
      });
      break;
    }

    case 'text': {
      const totalPoints = MIN_POINTS;
      const fontSize = config.fontSize;
      const text = config.textContent;
      
      // Create temporary canvas for text measurement
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) break;
      
      // Set up text rendering with bold weight
      tempCtx.font = `bold ${fontSize}px Arial`;
      tempCtx.textBaseline = 'middle';
      tempCtx.textAlign = 'center';
      
      // Get text measurements
      const textMetrics = tempCtx.measureText(text);
      const textWidth = textMetrics.width * 1.2; // Add some padding
      const textHeight = fontSize * 1.2;
      
      // Set canvas size
      tempCanvas.width = textWidth;
      tempCanvas.height = textHeight;
      
      // Redraw with proper settings after canvas resize
      tempCtx.font = `bold ${fontSize}px Arial`;
      tempCtx.textBaseline = 'middle';
      tempCtx.textAlign = 'center';
      
      // Draw text outline instead of filled text
      tempCtx.strokeStyle = 'white';
      tempCtx.lineWidth = 2;
      tempCtx.strokeText(text, textWidth / 2, textHeight / 2);
      
      // Sample points from outline
      const imageData = tempCtx.getImageData(0, 0, textWidth, textHeight);
      const data = imageData.data;
      
      // Track sampled positions to avoid duplicates
      const sampledPositions = new Set();
      
      // First pass: Find outline points
      for (let y = 0; y < textHeight; y++) {
        for (let x = 0; x < textWidth; x++) {
          const i = (y * textWidth + x) * 4;
          const alpha = data[i + 3];
          
          if (alpha > 0) {
            // Check if any neighboring pixel is transparent (indicating edge)
            const isEdge = 
              (x === 0 || data[i - 4 + 3] === 0) || // left
              (x === textWidth - 1 || data[i + 4 + 3] === 0) || // right
              (y === 0 || data[(y - 1) * textWidth * 4 + x * 4 + 3] === 0) || // top
              (y === textHeight - 1 || data[(y + 1) * textWidth * 4 + x * 4 + 3] === 0);   // bottom
            
            if (isEdge) {
              const posKey = `${x},${y}`;
              if (!sampledPositions.has(posKey)) {
                points.push({
                  x: centerX - (textWidth / 2) + x,
                  y: centerY - (textHeight / 2) + y
                });
                sampledPositions.add(posKey);
              }
            }
          }
        }
      }
      
      // Second pass: Ensure even distribution along outline
      const finalPoints: Point[] = [];
      const targetPointCount = MIN_POINTS;
      const step = Math.max(1, Math.floor(points.length / targetPointCount));
      
      for (let i = 0; i < points.length; i += step) {
        finalPoints.push(points[i]);
      }
      
      // Ensure minimum number of points
      while (finalPoints.length < MIN_POINTS && finalPoints.length > 0) {
        const randomIndex = Math.floor(Math.random() * finalPoints.length);
        const basePoint = finalPoints[randomIndex];
        if (basePoint) {
          finalPoints.push({
            x: basePoint.x + (Math.random() - 0.5),
            y: basePoint.y + (Math.random() - 0.5)
          });
        }
      }
      
      // If we still don't have enough points, add some at the center
      while (finalPoints.length < MIN_POINTS) {
        finalPoints.push({
          x: centerX + (Math.random() - 0.5) * fontSize * 0.1,
          y: centerY + (Math.random() - 0.5) * fontSize * 0.1
        });
      }
      
      return finalPoints;
      break;
    }
  }

  return points;
}

// Add getNextShape function
const getNextShape = (currentShape: string): string => {
  if (GRAPH_CONFIG.isRandomTransition) {
    // Get random shape excluding current
    const availableShapes = SHAPES.filter(shape => shape !== currentShape);
    return availableShapes[Math.floor(Math.random() * availableShapes.length)];
  } else {
    // Get next shape in sequence
    const currentIndex = SHAPES.indexOf(currentShape);
    return SHAPES[(currentIndex + 1) % SHAPES.length];
  }
};

export default function CompleteGraphAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const currentShapeRef = useRef<string>(SHAPES[0]);
  const nextShapeRef = useRef<string>(
    GRAPH_CONFIG.isRandomTransition 
      ? SHAPES[Math.floor(Math.random() * (SHAPES.length - 1)) + 1] // Random shape excluding current
      : SHAPES[1] // Next sequential shape
  );
  const transitionProgressRef = useRef<number>(0);
  const pointsRef = useRef<{
    currentPoints: Point[];
    nextPoints: Point[];
  }>({
    currentPoints: [],
    nextPoints: []
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    // Update canvas size function to use container dimensions
    const updateCanvasSize = () => {
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // Regenerate points when canvas is resized
      pointsRef.current.currentPoints = generateShapePoints(
        currentShapeRef.current,
        canvas.width,
        canvas.height,
        GRAPH_CONFIG
      );
      pointsRef.current.nextPoints = generateShapePoints(
        nextShapeRef.current,
        canvas.width,
        canvas.height,
        GRAPH_CONFIG
      );
    };

    // Initial setup
    updateCanvasSize();

    // Add resize observer for container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    resizeObserver.observe(container);

    const drawParticle = (particle: Particle) => {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(
        particle.position.x,
        particle.position.y,
        particle.radius,
        0,
        TWO_PI,
        true
      );
      ctx.closePath();
      ctx.fill();
    };

    let lastTransitionTime = 0;
    let lastShapeChangeTime = 0;

    // Initialize particles
    const particleGroups: Particle[][] = [];
    for (let i = 0; i < ANIMATION_CONFIG.particleCount; i++) {
      const startX = random(0, canvas.width);
      const startY = random(0, canvas.height);
      const hue = random(ANIMATION_CONFIG.colorRange.hue.min, ANIMATION_CONFIG.colorRange.hue.max);
      const saturation = random(ANIMATION_CONFIG.colorRange.saturation.min, ANIMATION_CONFIG.colorRange.saturation.max);
      const brightness = random(ANIMATION_CONFIG.colorRange.brightness.min, ANIMATION_CONFIG.colorRange.brightness.max);
      
      const particleGroup: Particle[] = [];
      for (let j = 0; j < ANIMATION_CONFIG.particleCount; j++) {
        particleGroup.push({
          position: { x: startX, y: startY },
          velocity: { x: 0, y: 0 },
          radius: random(ANIMATION_CONFIG.particleSize.min, ANIMATION_CONFIG.particleSize.max),
          speed: random(ANIMATION_CONFIG.speed.min, ANIMATION_CONFIG.speed.max),
          targetPointIndex: Math.floor(Math.random() * pointsRef.current.currentPoints.length),
          direction: 2 * (i % 2) - 1,
          friction: random(ANIMATION_CONFIG.friction.min, ANIMATION_CONFIG.friction.max),
          color: `hsla(${~~hue},${~~saturation}%,${~~brightness}%,${ANIMATION_CONFIG.colorRange.alpha})`
        });
      }
      particleGroups.push(particleGroup);
    }

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTransitionTime;
      
      if (timestamp - lastShapeChangeTime >= GRAPH_CONFIG.shapeChangeInterval) {
        lastShapeChangeTime = timestamp;
        currentShapeRef.current = nextShapeRef.current;
        nextShapeRef.current = getNextShape(currentShapeRef.current);
        
        pointsRef.current.currentPoints = pointsRef.current.nextPoints;
        pointsRef.current.nextPoints = generateShapePoints(
          nextShapeRef.current,
          canvas.width,
          canvas.height,
          GRAPH_CONFIG
        );
        
        transitionProgressRef.current = 0;
        lastTransitionTime = timestamp;
      }

      // Update transition progress
      transitionProgressRef.current = Math.min(
        deltaTime / GRAPH_CONFIG.transitionDuration,
        1
      );

      // Clear with transparency instead of solid color
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply fade effect with transparency
      ctx.fillStyle = `rgba(0, 0, 0, ${GRAPH_CONFIG.fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particleGroups.forEach(group => {
        const leader = group[0];
        
        const currentTarget = pointsRef.current.currentPoints[leader.targetPointIndex % pointsRef.current.currentPoints.length];
        const nextTarget = pointsRef.current.nextPoints[leader.targetPointIndex % pointsRef.current.nextPoints.length];
        const target = {
          x: currentTarget.x + (nextTarget.x - currentTarget.x) * transitionProgressRef.current,
          y: currentTarget.y + (nextTarget.y - currentTarget.y) * transitionProgressRef.current
        };

        // Calculate distance to target
        const dx = leader.position.x - target.x;
        const dy = leader.position.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Add chaotic movement if enabled
        if (GRAPH_CONFIG.isChaoticTransition) {
          const time = timestamp * 0.001; // Convert to seconds
          const chaos = GRAPH_CONFIG.chaoticIntensity * 10; // Scale factor for wave effect
          
          // Add wave motion based on time and position
          const waveX = Math.sin(time * 2 + leader.position.y * 0.05) * chaos;
          const waveY = Math.cos(time * 2 + leader.position.x * 0.05) * chaos;
          
          leader.velocity.x += waveX;
          leader.velocity.y += waveY;
        }

        // Update leader
        if (distance < 10) {
          if (Math.random() > 0.95) {
            leader.targetPointIndex = Math.floor(Math.random() * pointsRef.current.currentPoints.length);
          } else if (Math.random() > 0.99) {
            leader.direction *= -1;
            leader.targetPointIndex = (leader.targetPointIndex + leader.direction + pointsRef.current.currentPoints.length) % pointsRef.current.currentPoints.length;
          }
        }

        // Move leader
        leader.velocity.x += -dx / distance * leader.speed;
        leader.velocity.y += -dy / distance * leader.speed;
        leader.position.x += leader.velocity.x;
        leader.position.y += leader.velocity.y;
        leader.velocity.x *= leader.friction;
        leader.velocity.y *= leader.friction;
        
        drawParticle(leader);

        // Update follower particles
        for (let i = 0; i < group.length - 1; i++) {
          const current = group[i];
          const next = group[i + 1];
          
          next.position.x -= 0.7 * (next.position.x - current.position.x);
          next.position.y -= 0.7 * (next.position.y - current.position.y);
          
          drawParticle(next);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ]
      : [0, 0, 0];
  };

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        flex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'black',
        }}
      />
    </div>
  );
}