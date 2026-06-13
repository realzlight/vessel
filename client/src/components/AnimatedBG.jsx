import { useEffect, useRef } from 'react';

export default function AnimatedBG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    let globalTime = 0;

    // ========== GRID ==========
    class GridAnimation {
      constructor(width, height) {
        this.width = width;
        this.height = height;
        this.margin = 100;
        this.spacing = 90;
      }

      isActive(globalTime) {
        return globalTime < 4000;
      }

      getOpacity(globalTime) {
        if (globalTime < 500) return globalTime / 500;
        if (globalTime > 3500) return (4000 - globalTime) / 500;
        return 1;
      }

      draw(ctx, globalTime) {
        const opacity = this.getOpacity(globalTime);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.25})`;
        ctx.lineWidth = 1;

        for (let x = this.margin; x < this.width - this.margin; x += this.spacing) {
          ctx.beginPath();
          ctx.moveTo(x, this.margin);
          ctx.lineTo(x, this.height - this.margin);
          ctx.stroke();
        }

        for (let y = this.margin; y < this.height - this.margin; y += this.spacing) {
          ctx.beginPath();
          ctx.moveTo(this.margin, y);
          ctx.lineTo(this.width - this.margin, y);
          ctx.stroke();
        }
      }
    }

    // ========== WAVE ==========
    class WaveAnimation {
      constructor(width, height) {
        this.width = width;
        this.height = height;
      }

      isActive(globalTime) {
        return globalTime >= 3500 && globalTime < 7500;
      }

      getOpacity(globalTime) {
        const start = 3500;
        const end = 7500;
        if (globalTime < start + 500) return (globalTime - start) / 500;
        if (globalTime > end - 500) return (end - globalTime) / 500;
        return 1;
      }

      draw(ctx, globalTime) {
        const opacity = this.getOpacity(globalTime);
        const timeOffset = (globalTime - 3500) * 0.0008;
        const centerY = this.height / 2;
        const amplitude = 40;
        const frequency = 0.015;

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.35})`;
        ctx.lineWidth = 2;

        for (let waveIndex = 0; waveIndex < 3; waveIndex++) {
          const yOffset = centerY - 80 + waveIndex * 80;
          ctx.beginPath();

          for (let x = 0; x < this.width; x += 3) {
            const wave = Math.sin(x * frequency + timeOffset) * amplitude;
            const y = yOffset + wave;
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      }
    }

    // ========== CIRCLES (Particles) ==========
    class CircleParticles {
      constructor(width, height) {
        this.width = width;
        this.height = height;
        this.particles = [];

        for (let i = 0; i < 50; i++) {
          this.particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2 + 1,
            life: Math.random() * 0.7 + 0.4,
          });
        }
      }

      update() {
        this.particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > this.width) p.vx *= -1;
          if (p.y < 0 || p.y > this.height) p.vy *= -1;

          p.x = Math.max(0, Math.min(this.width, p.x));
          p.y = Math.max(0, Math.min(this.height, p.y));

          p.life += (Math.random() - 0.5) * 0.03;
          p.life = Math.max(0.3, Math.min(1, p.life));
        });
      }

      draw(ctx) {
        this.particles.forEach((p) => {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.5})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    const grid = new GridAnimation(canvas.width, canvas.height);
    const wave = new WaveAnimation(canvas.width, canvas.height);
    const circles = new CircleParticles(canvas.width, canvas.height);

    let lastTime = Date.now();
    let animationId = null;

    const animate = () => {
      const currentTime = Date.now();
      globalTime = currentTime - lastTime;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (grid.isActive(globalTime)) {
        grid.draw(ctx, globalTime);
      }

      if (wave.isActive(globalTime)) {
        wave.draw(ctx, globalTime);
      }

      circles.update();
      circles.draw(ctx);

      if (globalTime > 12000) {
        lastTime = Date.now();
      }

      animationId = requestAnimationFrame(animate);
    };

    lastTime = Date.now();
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