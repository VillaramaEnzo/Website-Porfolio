import React, { useEffect, useRef } from 'react';

interface Particle {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  radius: number;
  speed: number;
  targetPointIndex: number;
  direction: number;
  friction: number;
  color: string;
}

interface HeartConfig {
  size: number;
  yOffset: number;
  pointDensity: number;
}

interface AnimationConfig {
  particleCount: number;
  particleSize: { min: number; max: number };
  speed: { min: number; max: number };
  friction: { min: number; max: number };
  colorRange: {
    hue: { min: number; max: number };
    saturation: { min: number; max: number };
    brightness: { min: number; max: number };
    alpha: number;
  };
  fadeSpeed: number;
  backgroundColor: string;
  fadeAlpha: number;
}

export default function HeartAnimationV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heartPointsRef = useRef<[number, number][]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration objects
    const ANIMATION_CONFIG: AnimationConfig = {
      particleCount: 300,
      particleSize: { min: 0.2, max: 2 },
      speed: { min: 1, max: 2 },
      friction: { min: 0.7, max: 0.9 },
      colorRange: {
        hue: { min: 340, max: 360 },
        saturation: { min: 60, max: 100 },
        brightness: { min: 20, max: 80 },
        alpha: 0.1
      },
      fadeSpeed: 0.2,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      fadeAlpha: 0.2
    };

    const HEART_LAYERS: HeartConfig[] = [
      { size: 210, yOffset: 13, pointDensity: 0.2 },
      { size: 150, yOffset: 9, pointDensity: 0.4 },
      { size: 90, yOffset: 5, pointDensity: 0.8 }
    ];

    // Canvas setup with container dimensions
    const updateCanvasSize = () => {
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // Regenerate heart points when canvas is resized
      heartPointsRef.current = generateHeartPoints();
    };

    const generateHeartPoints = (): [number, number][] => {
      const points: [number, number][] = [];
      const TWO_PI = Math.PI * 2;

      HEART_LAYERS.forEach(layer => {
        for (let angle = 0; angle < TWO_PI; angle += layer.pointDensity) {
          const x = canvas.width / 2 + layer.size * Math.pow(Math.sin(angle), 3);
          const y = canvas.height / 2 + layer.yOffset * -(
            15 * Math.cos(angle) - 
            5 * Math.cos(2 * angle) - 
            2 * Math.cos(3 * angle) - 
            Math.cos(4 * angle)
          );
          points.push([x, y]);
        }
      });
      return points;
    };

    // Initial setup
    updateCanvasSize();

    // Add resize observer for container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    resizeObserver.observe(container);

    // Initialize particles
    const random = (min: number, max: number) => Math.random() * (max - min) + min;
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
          targetPointIndex: Math.floor(Math.random() * heartPointsRef.current.length),
          direction: 2 * (i % 2) - 1,
          friction: random(ANIMATION_CONFIG.friction.min, ANIMATION_CONFIG.friction.max),
          color: `hsla(${~~hue},${~~saturation}%,${~~brightness}%,${ANIMATION_CONFIG.colorRange.alpha})`
        });
      }
      particleGroups.push(particleGroup);
    }

    // Drawing function
    const drawParticle = (particle: Particle) => {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.position.x, particle.position.y, particle.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = `rgba(0, 0, 0, ${ANIMATION_CONFIG.fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particleGroups.forEach(group => {
        const leader = group[0];
        const target = heartPointsRef.current[leader.targetPointIndex];
        
        const dx = leader.position.x - target[0];
        const dy = leader.position.y - target[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 10) {
          if (Math.random() > 0.95) {
            leader.targetPointIndex = Math.floor(Math.random() * heartPointsRef.current.length);
          } else if (Math.random() > 0.99) {
            leader.direction *= -1;
            leader.targetPointIndex = (leader.targetPointIndex + leader.direction + heartPointsRef.current.length) % heartPointsRef.current.length;
          }
        }

        leader.velocity.x += -dx / distance * leader.speed;
        leader.velocity.y += -dy / distance * leader.speed;
        leader.position.x += leader.velocity.x;
        leader.position.y += leader.velocity.y;
        leader.velocity.x *= leader.friction;
        leader.velocity.y *= leader.friction;
        
        drawParticle(leader);

        for (let i = 0; i < group.length - 1; i++) {
          const current = group[i];
          const next = group[i + 1];
          
          next.position.x -= 0.7 * (next.position.x - current.position.x);
          next.position.y -= 0.7 * (next.position.y - current.position.y);
          
          drawParticle(next);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
