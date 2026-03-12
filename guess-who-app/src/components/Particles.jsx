import { useEffect, useRef } from 'react';

export default function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FECA57', '#A855F7', '#FF8E53'];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = 2 + Math.random() * 3;
        this.speedY = -(0.3 + Math.random() * 0.7);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 0.1 + Math.random() * 0.2;
        this.life = 0;
        this.maxLife = 200 + Math.random() * 300;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        // Fade in and out
        if (this.life < 30) {
          this.opacity = (this.life / 30) * 0.25;
        } else if (this.life > this.maxLife - 50) {
          this.opacity = ((this.maxLife - this.life) / 50) * 0.25;
        }

        if (this.life >= this.maxLife || this.y < -10) {
          this.reset();
        }
      }

      draw() {
        // Pixel-style square particles
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillRect(
          Math.round(this.x / this.size) * this.size,
          Math.round(this.y / this.size) * this.size,
          this.size,
          this.size
        );
      }
    }

    // Create particles
    for (let i = 0; i < 40; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
