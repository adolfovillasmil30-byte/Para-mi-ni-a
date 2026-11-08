import React, { useEffect, useRef } from 'react';

interface Heart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swaySpeed: number;
  swayDist: number;
  angle: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export const FloatingHearts: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(244, 187, 194, ', // soft blush pink
      'rgba(235, 148, 161, ', // delicate rose
      'rgba(218, 165, 152, ', // warm dusty terracotta rose
      'rgba(224, 188, 140, ', // champagne gold
      'rgba(206, 178, 222, ', // pastel purple / lavender
      'rgba(240, 208, 214, ', // ultra soft blush
      'rgba(229, 56, 59, ',   // delicate ruby red
    ];

    const hearts: Heart[] = [];
    const count = Math.min(28, Math.floor((width * height) / 36000)); // Delicate density

    const createHeart = (initialY?: number): Heart => {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      const baseOpacity = 0.14 + Math.random() * 0.26; // soft romantic opacity
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : height + 15 + Math.random() * 60,
        size: 10 + Math.random() * 16,
        speedY: 0.55 + Math.random() * 0.8,
        speedX: 0,
        swaySpeed: 0.012 + Math.random() * 0.02,
        swayDist: 15 + Math.random() * 25,
        angle: Math.random() * Math.PI * 2,
        opacity: baseOpacity,
        color: colorBase,
        rotation: (Math.random() - 0.5) * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
      };
    };

    // Initialize all hearts starting from the bottom of the web and staggered to float all the way to the top
    for (let i = 0; i < count; i++) {
      hearts.push(createHeart(height + i * 30 + Math.random() * 20));
    }

    // Helper to draw a heart path
    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      opacity: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.beginPath();

      const topCurveHeight = size * 0.3;
      context.moveTo(0, topCurveHeight);
      // top left curve
      context.bezierCurveTo(
        -size / 2,
        -topCurveHeight,
        -size,
        size / 3,
        0,
        size
      );
      // top right curve
      context.bezierCurveTo(
        size,
        size / 3,
        size / 2,
        -topCurveHeight,
        0,
        topCurveHeight
      );

      context.closePath();
      context.fillStyle = `${color}${opacity})`;
      context.fill();
      context.restore();
    };

    // Burst of tiny hearts on click
    const handleDocumentClick = (e: MouseEvent) => {
      // Spawn 3 tiny hearts around click position
      for (let i = 0; i < 3; i++) {
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        hearts.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          size: 7 + Math.random() * 9,
          speedY: 1.1 + Math.random() * 0.8,
          speedX: (Math.random() - 0.5) * 1.2,
          swaySpeed: 0.03,
          swayDist: 10,
          angle: Math.random() * Math.PI,
          opacity: 0.45,
          color: colorBase,
          rotation: (Math.random() - 0.5) * 0.5,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    };

    window.addEventListener('click', handleDocumentClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y -= h.speedY;
        h.angle += h.swaySpeed;
        h.rotation += h.rotationSpeed;
        const currentX = h.x + Math.sin(h.angle) * h.swayDist;

        drawHeart(ctx, currentX, h.y, h.size, h.rotation, h.color, h.opacity);

        // Reset heart when it reaches top
        if (h.y < -50) {
          if (hearts.length > count) {
            // Remove click bursts once they float away
            hearts.splice(i, 1);
          } else {
            hearts[i] = createHeart(height + 20);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleDocumentClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
