import React, { useState, useEffect } from 'react';
import { Music, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

export const AudioControl: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggle = () => {
    const nextState = romanticAudio.toggleMusic();
    setIsPlaying(nextState);
    setHasInteracted(true);
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={toggle}
        aria-label={isPlaying ? "Pausar música romántica" : "Reproducir música romántica"}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-300 text-xs font-medium shadow-sm backdrop-blur-md ${
          isPlaying
            ? "bg-[#F7EBE8]/95 border-[#E2B7B0] text-[#8C2D3B] ring-2 ring-[#B83A4B]/20"
            : "bg-white/90 border-[#EAD7D1] text-[#7A6964] hover:bg-[#FAF2EF]"
        }`}
      >
        <div className="relative">
          <Music className={`w-4 h-4 ${isPlaying ? "animate-bounce" : ""}`} />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B83A4B] animate-ping" />
          )}
        </div>
        <span className="hidden sm:inline">
          {isPlaying ? "Música romántica activa" : "Música de fondo"}
        </span>
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-[#B83A4B]" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-[#A3928E]" />
        )}
      </button>
    </div>
  );
};
