import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

interface PullToRevealSecretProps {
  children: React.ReactNode;
}

export const PullToRevealSecret: React.FC<PullToRevealSecretProps> = ({ children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasTriggeredAudio, setHasTriggeredAudio] = useState(false);

  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const THRESHOLD = 85;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 2) {
        startYRef.current = e.touches[0].clientY;
        setIsDragging(true);
        setHasTriggeredAudio(false);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging && window.scrollY <= 2 && e.touches[0].clientY > startYRef.current) {
        setIsDragging(true);
        startYRef.current = e.touches[0].clientY;
      }

      if (isDragging && window.scrollY <= 2) {
        currentYRef.current = e.touches[0].clientY;
        const delta = currentYRef.current - startYRef.current;
        if (delta > 0) {
          // Logarithmic damping for natural elastic rubber-band feel
          const distance = Math.min(130, Math.pow(delta, 0.82) * 2.2);
          setPullDistance(distance);

          if (distance >= THRESHOLD && !hasTriggeredAudio) {
            setHasTriggeredAudio(true);
            romanticAudio.playChime();
            if (navigator.vibrate) {
              try {
                navigator.vibrate(40);
              } catch (_) {}
            }
          }
        }
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        if (pullDistance >= THRESHOLD) {
          setIsRevealed(true);
        }
        setPullDistance(0);
      }
    };

    // Also support mouse drag on desktop when at top of page
    const handleMouseDown = (e: MouseEvent) => {
      if (window.scrollY <= 2 && e.clientY < 180) {
        startYRef.current = e.clientY;
        setIsDragging(true);
        setHasTriggeredAudio(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && window.scrollY <= 2) {
        const delta = e.clientY - startYRef.current;
        if (delta > 0) {
          const distance = Math.min(130, Math.pow(delta, 0.82) * 2.2);
          setPullDistance(distance);

          if (distance >= THRESHOLD && !hasTriggeredAudio) {
            setHasTriggeredAudio(true);
            romanticAudio.playChime();
          }
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (pullDistance >= THRESHOLD) {
          setIsRevealed(true);
        }
        setPullDistance(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, pullDistance, hasTriggeredAudio]);

  const progress = Math.min(1, pullDistance / THRESHOLD);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* 
        Persistent Revealed Banner
        Appears gracefully when unlocked by pulling down
      */}
      {isRevealed && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/98 border-b border-[#EAD7D1] shadow-[0_10px_30px_rgba(184,58,75,0.14)] backdrop-blur-md px-4 py-3 sm:py-4 transition-all duration-500 animate-fadeIn">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF0ED] border border-[#F0D5CF] flex items-center justify-center shadow-inner shrink-0">
                <Heart className="w-5 h-5 fill-[#B83A4B] text-[#B83A4B] animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B83A4B] font-semibold block">
                  Mensaje secreto de amor
                </span>
                {/* EXACT REQUIRED TEXT */}
                <p className="font-script text-2xl sm:text-3xl text-[#2D1E1C] leading-tight pt-0.5">
                  Mivi te ama con todo su corazon 💗
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRevealed(false)}
              className="p-1.5 rounded-full text-[#8C7A75] hover:bg-[#FAF0ED] hover:text-[#4A3E3D] transition-colors cursor-pointer shrink-0"
              title="Cerrar mensaje secreto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 
        Elastic Pull-to-Reveal Indicator Drawer
        Peeks from top as user pulls down with rubber-band physics
      */}
      <div
        className="fixed top-0 left-0 right-0 z-30 pointer-events-none flex flex-col items-center justify-center text-center transition-opacity"
        style={{
          height: `${Math.max(pullDistance, isRevealed ? 0 : 0)}px`,
          opacity: pullDistance > 10 ? 1 : 0,
        }}
      >
        <div className="bg-[#FDFBF7]/95 backdrop-blur-md border border-[#EAD7D1] rounded-2xl px-5 py-2.5 shadow-lg flex items-center gap-2.5 transform transition-transform">
          <Heart
            className="w-4 h-4 text-[#B83A4B] transition-all"
            style={{
              transform: `scale(${0.85 + progress * 0.4}) rotate(${progress * 15}deg)`,
              fill: progress >= 0.9 ? '#B83A4B' : 'transparent',
            }}
          />
          <div className="text-left">
            {pullDistance >= THRESHOLD ? (
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#B83A4B] font-bold block">
                  ¡Suelta la pantalla!
                </span>
                <span className="font-script text-xl text-[#2D1E1C]">
                  Mivi te ama con todo su corazon 💗
                </span>
              </div>
            ) : (
              <span className="text-xs font-serif-title font-medium text-[#5A4843]">
                Desliza hacia abajo para descubrir un secreto...
              </span>
            )}
          </div>
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
        </div>
      </div>

      {/* 
        Page Content with Rubber-Band Elastic Translation
      */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="w-full min-h-screen"
      >
        {children}
      </div>
    </div>
  );
};
