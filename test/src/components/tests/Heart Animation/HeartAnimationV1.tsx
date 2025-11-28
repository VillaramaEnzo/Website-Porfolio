import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  targetIndex: number;
  heartIndex: number;
  trail: { x: number; y: number }[];
  trailLength: number;
  friction: number;
  isSwapping?: boolean;
  swapTarget?: {
    heartIndex: number;
    targetIndex: number;
  };
  isTracer?: boolean;
  tracerDirection?: 'clockwise' | 'counterclockwise';
  tracerSpeed?: number;
}

// Heart configuration
interface HeartConfig {
  size: number;
  yOffset: number;
  distribution: number;
}

// Color configuration
const PARTICLE_COLORS = {
  SLOW: 'hsl(340, 100%, 90%)', // Almost white pink for slow particles
  MEDIUM: 'hsl(350, 100%, 75%)', // Light pink for medium speed
  FAST: 'hsl(360, 100%, 60%)' // Deep red for fast particles
};

const MAX_SPEED = 5; // Maximum expected particle speed
const MIN_SPEED = 0.05; // Minimum speed from before

// Configuration for tracer particles
const TRACERS_PER_HEART = 0; // One pair per heart
const TRACER_SPEED = 0.1; // Slower for smoother movement
const TRACER_COLOR = 'hsla(350, 100%, 60%, 0)'; // Fully transparent tracer
const TRACER_TRAIL_LENGTH = 50;
const TRACER_SIZE = 1.8;
const REGULAR_PARTICLE_SIZE = 5;

export default function HeartAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration
    const TOTAL_PARTICLES = 60;
  
    // Define hearts dynamically
    const HEARTS: HeartConfig[] = [
      {
        size: 20,
        yOffset: 0,
        distribution: 0.55 // 50% of particles
      },
       
      {
        size: 13,
        yOffset: -10,
        distribution: 0.3 // 30% of particles
      },
      {
        size: 7,
        yOffset: -15,
        distribution: 0.15 // 20% of particles
      } 
      // Add more hearts as needed...
    ];

    // Calculate minimum particles once
    const MIN_PARTICLES_PER_HEART = HEARTS.map(heart => 
      Math.floor(TOTAL_PARTICLES * heart.distribution)
    );

    // Movement and visual parameters
    const TWO_PI = Math.PI * 2;
    const TRAIL_LENGTH = 15;
    const MOVEMENT_SPEED = 0.2;
    const BASE_FRICTION = 0.95;
    const FRICTION_RANGE = 0.01; // Amount of random variation in friction
    const JITTER = 0.2;
    const TRANSITION_DISTANCE = 8;
    const POINT_RANGE_DIVISOR = 8;
    const POINT_DENSITY = 0.15; // Points per unit of heart size


    // Adjust swap configuration
    const SWAP_CHANCE = 1; // Chance for path change
    const SWAP_TRANSITION_SPEED = 0.5;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Generate heart layers dynamically
    const heartLayers: [number, number][][] = HEARTS.map(heart => {
      const points: [number, number][] = [];
      const numPoints = Math.max(Math.floor(heart.size / POINT_DENSITY), 30);
      const angleStep = TWO_PI / numPoints;
      
      for (let angle = 0; angle < TWO_PI; angle += angleStep) {
        // Improved heart curve formula
        const x = canvas.width / 2 + heart.size * 16 * Math.pow(Math.sin(angle), 3);
        const y = canvas.height / 2 + heart.yOffset - heart.size * (
          13 * Math.cos(angle) - 
          5 * Math.cos(2 * angle) - 
          2 * Math.cos(3 * angle) - 
          Math.cos(4 * angle)
        );
        points.push([x, y]);
      }
      return points;
    });

    // Create particles for each heart layer
    const particles: Particle[] = [];

    // Helper function to create particles for each heart
    const createHeartParticles = (count: number, heartIndex: number) => {
      const heartPoints = heartLayers[heartIndex];
      const totalPoints = heartPoints.length;
      
      // Create tracer particles first
      for (let i = 0; i < TRACERS_PER_HEART; i++) {
        const isClockwise = i < TRACERS_PER_HEART / 2;
        
        // Start at true top center (π)
        // This is where the two curves meet at the top
        const startAngle = Math.PI;
        const startIndex = Math.floor((startAngle / TWO_PI) * totalPoints);
        
        particles.push({
          x: heartPoints[startIndex][0],
          y: heartPoints[startIndex][1],
          vx: 0,
          vy: 0,
          radius: TRACER_SIZE,
          color: TRACER_COLOR,
          targetIndex: startIndex,
          heartIndex,
          trail: [],
          trailLength: TRACER_TRAIL_LENGTH,
          friction: BASE_FRICTION,
          isTracer: true,
          tracerDirection: isClockwise ? 'clockwise' : 'counterclockwise',
          tracerSpeed: TRACER_SPEED
        });
      }

      // Create remaining regular particles
      const remainingCount = count - TRACERS_PER_HEART;
      for (let i = 0; i < remainingCount; i++) {
        const randomFriction = BASE_FRICTION + (Math.random() * 2 - 1) * FRICTION_RANGE;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
          radius: REGULAR_PARTICLE_SIZE, // Regular size for normal particles
          color: PARTICLE_COLORS.SLOW,
          targetIndex: Math.floor(Math.random() * heartLayers[heartIndex].length),
          heartIndex,
          trail: [],
          trailLength: TRAIL_LENGTH + Math.floor(Math.random() * 10),
          friction: randomFriction,
          isTracer: false
        });
      }
    };

    // Create particles for each heart
    HEARTS.forEach((heart, index) => {
      const particleCount = Math.floor(TOTAL_PARTICLES * heart.distribution);
      createHeartParticles(particleCount, index);
    });

    // Animation loop
    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // First, handle potential swaps
      particles.forEach((particle, index) => {
        if (particle.isTracer) {
          const heartPoints = heartLayers[particle.heartIndex];
          const totalPoints = heartPoints.length;
          
          // Update target index based on direction
          if (particle.tracerDirection === 'clockwise') {
            particle.targetIndex = (particle.targetIndex + 1) % totalPoints;
          } else {
            particle.targetIndex = (particle.targetIndex - 1 + totalPoints) % totalPoints;
          }
          
          // Move directly to next point
          const target = heartPoints[particle.targetIndex];
          const dx = target[0] - particle.x;
          const dy = target[1] - particle.y;
          
          // Direct linear movement without any randomness
          particle.x += dx * particle.tracerSpeed!;
          particle.y += dy * particle.tracerSpeed!;
          
          // Update trail
          particle.trail.push({ x: particle.x, y: particle.y });
          if (particle.trail.length > particle.trailLength) {
            particle.trail.shift();
          }
          
          // Draw trail with opacity but invisible particle
          if (particle.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
            particle.trail.forEach((point, index) => {
              const opacity = Math.pow(index / particle.trail.length, 1.3);
              ctx.strokeStyle = `hsla(350, 100%, 60%, ${opacity})`; // Trail still visible
              ctx.lineWidth = particle.radius * (0.5 + opacity * 0.5);
              ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
          }
          
          // Keep particle itself invisible
          particle.color = 'hsla(350, 100%, 60%, 0)';
        } else {
          if (!particle.isSwapping && Math.random() < SWAP_CHANCE) {
            const heartCounts = [0, 1, 2].map(heartIndex => 
              particles.filter(p => p.heartIndex === heartIndex && !p.isSwapping).length
            );
            
            // Only allow path change if at or above distribution threshold
            const otherHeartIndices = Array.from(
              { length: HEARTS.length }, 
              (_, i) => i
            ).filter(i => {
              const currentCount = heartCounts[particle.heartIndex];
              const targetCount = heartCounts[i];
              return i !== particle.heartIndex && 
                     targetCount > MIN_PARTICLES_PER_HEART[i] - 2 && 
                     currentCount > MIN_PARTICLES_PER_HEART[particle.heartIndex] - 2;
            });
            
            if (otherHeartIndices.length > 0) {
              const targetHeartIndex = otherHeartIndices[Math.floor(Math.random() * otherHeartIndices.length)];
              
              // Find a particle from target heart to balance the swap
              const balancingParticles = particles.filter((p, i) => 
                i !== index && 
                p.heartIndex === targetHeartIndex && 
                !p.isSwapping
              );
              
              if (balancingParticles.length > 0) {
                const balancingParticle = balancingParticles[Math.floor(Math.random() * balancingParticles.length)];
                
                // Start path changes for both particles
                particle.isSwapping = true;
                balancingParticle.isSwapping = true;
                
                // Each particle gets a random target point in their new heart path
                particle.swapTarget = {
                  heartIndex: targetHeartIndex,
                  targetIndex: Math.floor(Math.random() * heartLayers[targetHeartIndex].length)
                };
                
                balancingParticle.swapTarget = {
                  heartIndex: particle.heartIndex,
                  targetIndex: Math.floor(Math.random() * heartLayers[particle.heartIndex].length)
                };
              }
            }
          }

          // Handle movement during path transition
          if (particle.isSwapping && particle.swapTarget) {
            const newHeartPoints = heartLayers[particle.swapTarget.heartIndex];
            const newTarget = newHeartPoints[particle.swapTarget.targetIndex];
            
            const dx = newTarget[0] - particle.x;
            const dy = newTarget[1] - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < TRANSITION_DISTANCE) {
              // Complete the path change
              particle.heartIndex = particle.swapTarget.heartIndex;
              particle.targetIndex = particle.swapTarget.targetIndex;
              particle.color = PARTICLE_COLORS.SLOW;
              particle.isSwapping = false;
              particle.swapTarget = undefined;
            } else {
              // Move towards new path point
              const dirX = dx / distance;
              const dirY = dy / distance;
              
              // Strong directional movement during transition
              particle.vx += dirX * MOVEMENT_SPEED * SWAP_TRANSITION_SPEED;
              particle.vy += dirY * MOVEMENT_SPEED * SWAP_TRANSITION_SPEED;
              
              // Maintain some randomness during transition
              particle.vx += (Math.random() - 0.5) * JITTER * 0.3;
              particle.vy += (Math.random() - 0.5) * JITTER * 0.3;
            }
          } else {
            // Original movement code...
            const heartPoints = heartLayers[particle.heartIndex];
            const target = heartPoints[particle.targetIndex];
            
            // Calculate direction to target
            const dx = target[0] - particle.x;
            const dy = target[1] - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < TRANSITION_DISTANCE) {
              // Use the predefined POINT_RANGE_DIVISOR
              const pointRange = Math.floor(heartPoints.length / POINT_RANGE_DIVISOR);
              const offset = Math.floor(Math.random() * (pointRange * 2 + 1)) - pointRange;
              const totalPoints = heartPoints.length;
              particle.targetIndex = ((particle.targetIndex + offset) % totalPoints + totalPoints) % totalPoints;
            } else {
              // Direct movement to target point
              const dirX = dx / distance;
              const dirY = dy / distance;
              
              // Add strong directional movement
              particle.vx += dirX * MOVEMENT_SPEED;
              particle.vy += dirY * MOVEMENT_SPEED;
              
              // Add perpendicular random movement for more organic paths
              const perpX = -dirY;
              const perpY = dirX;
              const randomAngle = Math.random() * Math.PI * 2;
              const randomStrength = Math.random() * JITTER;
              
              particle.vx += perpX * randomStrength * Math.cos(randomAngle);
              particle.vy += perpY * randomStrength * Math.sin(randomAngle);
            }

            // Apply individual friction
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;

            // Ensure minimum speed
            const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (currentSpeed < MIN_SPEED) {
              const speedMultiplier = MIN_SPEED / currentSpeed;
              particle.vx *= speedMultiplier;
              particle.vy *= speedMultiplier;
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Update trail
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > particle.trailLength) {
              particle.trail.shift();
            }

            // Draw trail
            if (particle.trail.length > 1) {
              ctx.beginPath();
              ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
              particle.trail.forEach((point, index) => {
                const opacity = Math.pow(index / particle.trail.length, 1.3);
                ctx.strokeStyle = particle.color.replace(')', `,${opacity})`).replace('hsl', 'hsla');
                ctx.lineWidth = particle.radius * (0.5 + opacity * 0.5);
                ctx.lineTo(point.x, point.y);
              });
              ctx.stroke();
            }

            // Calculate current speed
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            
            // Normalize speed between 0 and 1
            const normalizedSpeed = Math.min(Math.max((speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED), 0), 1);
            
            // Calculate color based on speed with wider range
            const hue = 340 + (normalizedSpeed * 20); // Range from 340 to 360
            const saturation = 100;
            const lightness = 90 - (normalizedSpeed * 30); // Range from 90% to 60%
            
            particle.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          }
        }
      });

      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        background: 'black',
      }}
    />
  );
};

