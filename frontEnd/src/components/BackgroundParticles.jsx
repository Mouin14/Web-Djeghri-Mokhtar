
import { useEffect, useRef } from 'react';

const BackgroundParticles = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isMouseMoving = useRef(false);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];

    const colors = [
      'rgba(5, 102, 141, 0.7)',  // brand-primary
      'rgba(2, 128, 144, 0.7)',  // brand-secondary
      'rgba(0, 168, 150, 0.7)',  // brand-accent
      'rgba(2, 195, 154, 0.7)',  // brand-success
      'rgba(250, 204, 21, 0.7)', // brand-yellow
    ];

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(window.innerWidth * 0.2, 800);

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          originX: x,
          originY: y,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2 + 0.5,
        });
      }
      particlesRef.current = particles;
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      isMouseMoving.current = true;

      if (handleMouseMove.timeout) clearTimeout(handleMouseMove.timeout);
      handleMouseMove.timeout = setTimeout(() => {
        isMouseMoving.current = false;
      }, 1500);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const connectionDistance = 120;
      const mouseInteractionRadius = 250;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        const dx = mouseRef.current.x - p1.x;
        const dy = mouseRef.current.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInteractionRadius) {
          const force = (mouseInteractionRadius - distance) / mouseInteractionRadius;
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const repulsionStrength = 8;

          p1.vx -= forceDirectionX * force * repulsionStrength;
          p1.vy -= forceDirectionY * force * repulsionStrength;
        } else {
          const returnSpeed = 0.015;
          p1.vx += (p1.originX - p1.x) * returnSpeed;
          p1.vy += (p1.originY - p1.y) * returnSpeed;
        }

        p1.vx *= 0.92;
        p1.vy *= 0.92;
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Constellation Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ldx = p1.x - p2.x;
          const ldy = p1.y - p2.y;
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy);

          if (ldist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = p1.color;

            // Adjust opacity based on distance and mouse proximity
            const mouseDist1 = Math.sqrt(Math.pow(p1.x - mouseRef.current.x, 2) + Math.pow(p1.y - mouseRef.current.y, 2));
            const mouseGlow = mouseDist1 < mouseInteractionRadius ? (1 - mouseDist1 / mouseInteractionRadius) * 0.5 : 0;

            ctx.globalAlpha = (1 - ldist / connectionDistance) * (0.15 + mouseGlow);
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.closePath();
          }
        }

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.closePath();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1, background: 'transparent' }}
    />
  );
};

export default BackgroundParticles;
