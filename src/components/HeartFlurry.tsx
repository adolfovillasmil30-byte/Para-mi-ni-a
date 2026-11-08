import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

interface HeartFlurryProps {
  active: boolean;
  onComplete?: () => void;
}

export const HeartFlurry: React.FC<HeartFlurryProps> = ({ active, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    // Palette: Red, Pink, and Pastel Purple
    const colors = [
      '#E63946', // vibrant romantic red
      '#D90429', // deep ruby red
      '#F4A5AE', // soft pastel pink
      '#FFCAD4', // blush pink
      '#FF758F', // warm rose
      '#C8B6E2', // pastel purple
      '#D8BBFF', // light lilac purple
      '#BDB2FF', // soft lavender purple
      '#E2CFEA', // muted mauve pastel
    ];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.55;

    const newParticles: Particle[] = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI; // burst upwards in a fan
      const speed = 4 + Math.random() * 8;

      newParticles.push({
        id: i,
        x: centerX + (Math.random() - 0.5) * 60,
        y: centerY + (Math.random() - 0.5) * 40,
        size: 14 + Math.random() * 22,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angle) * speed * 1.4,
        speedY: Math.sin(angle) * speed - 2, // upwards boost
        rotation: (Math.random() - 0.5) * 60,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 0.95,
      });
    }

    setParticles(newParticles);

    const startTime = Date.now();
    let animId: number;

    const update = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 2800) {
        setParticles([]);
        if (onComplete) onComplete();
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.speedX,
          y: p.y + p.speedY,
          speedY: p.speedY + 0.18, // gravity pull
          speedX: p.speedX * 0.98,
          rotation: p.rotation + p.rotationSpeed,
          opacity: Math.max(0, p.opacity - 0.012),
        }))
      );

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animId);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            fontSize: `${p.size}px`,
            color: p.color,
            textShadow: `0 0 10px ${p.color}55`,
            transition: 'opacity 0.1s linear',
          }}
          className="select-none"
        >
          ♥
        </div>
      ))}
    </div>
  );
};
