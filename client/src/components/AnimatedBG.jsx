import { useEffect, useRef } from 'react';
import '../styles/AnimatedBG.css';

export default function AnimatedBG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    // Particles
    const particles = [];
    const particleCount = 60;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.6 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Grid animation
    let gridOffset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw grids (offset from edges)
      const gridSpacing = 60;
      const margin = 80;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;

      // Horizontal grid lines with wave effect
      for (let y = margin; y < height - margin; y += gridSpacing) {
        ctx.beginPath();
        for (let x = margin; x < width - margin; x += 10) {
          const wave = Math.sin((x + gridOffset) * 0.01) * 8;
          if (x === margin) {
            ctx.moveTo(x, y + wave);
          } else {
            ctx.lineTo(x, y + wave);
          }
        }
        ctx.stroke();
      }

      // Vertical grid lines with wave effect
      for (let x = margin; x < width - margin; x += gridSpacing) {
        ctx.beginPath();
        for (let y = margin; y < height - margin; y += 10) {
          const wave = Math.sin((y + gridOffset) * 0.01) * 8;
          if (y === margin) {
            ctx.moveTo(x + wave, y);
          } else {
            ctx.lineTo(x + wave, y);
          }
        }
        ctx.stroke();
      }

      // Draw animated triangles (double-sided diamonds)
      const trianglePositions = [
        { x: width * 0.15, y: height * 0.2 },
        { x: width * 0.85, y: height * 0.3 },
        { x: width * 0.25, y: height * 0.75 },
        { x: width * 0.75, y: height * 0.85 },
        { x: width * 0.5, y: height * 0.5 },
      ];

      trianglePositions.forEach((pos, i) => {
        const time = gridOffset * 0.05 + i;
        const scale = Math.sin(time * 0.02) * 0.3 + 0.7;
        const rotation = (time * 0.5) % 360;
        const opacity = Math.sin(time * 0.02) * 0.3 + 0.15;

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);

        // Draw diamond (double-sided triangle)
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(20, 0);
        ctx.lineTo(0, 20);
        ctx.lineTo(-20, 0);
        ctx.closePath();
        ctx.stroke();

        // Inner diamond
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(10, 0);
        ctx.lineTo(0, 10);
        ctx.lineTo(-10, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
      });

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      gridOffset += 0.5;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="animated-bg-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
