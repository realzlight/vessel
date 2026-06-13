import { useEffect, useRef } from 'react';

export default function AnimatedBG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context failed');
      return;
    }

    // Set initial size
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    // Particles
    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let gridOffset = 0;
    let animationId = null;

    const animate = () => {
      // Clear and fill background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const margin = 100;
      const gridSpacing = 80;

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 0.8;

      // Horizontal lines
      for (let y = margin; y < canvas.height - margin; y += gridSpacing) {
        ctx.beginPath();
        for (let x = margin; x < canvas.width - margin; x += 5) {
          const wave = Math.sin((x + gridOffset) * 0.008) * 6;
          if (x === margin) {
            ctx.moveTo(x, y + wave);
          } else {
            ctx.lineTo(x, y + wave);
          }
        }
        ctx.stroke();
      }

      // Vertical lines
      for (let x = margin; x < canvas.width - margin; x += gridSpacing) {
        ctx.beginPath();
        for (let y = margin; y < canvas.height - margin; y += 5) {
          const wave = Math.sin((y + gridOffset) * 0.008) * 6;
          if (y === margin) {
            ctx.moveTo(x + wave, y);
          } else {
            ctx.lineTo(x + wave, y);
          }
        }
        ctx.stroke();
      }

      // Draw triangles/diamonds
      const positions = [
        { x: canvas.width * 0.15, y: canvas.height * 0.25 },
        { x: canvas.width * 0.85, y: canvas.height * 0.35 },
        { x: canvas.width * 0.2, y: canvas.height * 0.8 },
        { x: canvas.width * 0.8, y: canvas.height * 0.75 },
      ];

      positions.forEach((pos, i) => {
        const time = gridOffset * 0.03 + i * 10;
        const scale = Math.sin(time * 0.01) * 0.4 + 0.8;
        const rotation = time * 0.3;
        const opacity = Math.sin(time * 0.015) * 0.25 + 0.2;

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);

        // Diamond outline
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(25, 0);
        ctx.lineTo(0, 25);
        ctx.lineTo(-25, 0);
        ctx.closePath();
        ctx.stroke();

        // Inner diamond
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(12, 0);
        ctx.lineTo(0, 12);
        ctx.lineTo(-12, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
      });

      // Draw particles
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      gridOffset += 0.4;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setSize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'block',
      }}
    />
  );
}