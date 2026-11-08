import React, { useState, useEffect } from 'react';
import { Clock, Heart, Calendar, Sparkles } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

// Key for persistent start time
const STORAGE_KEY = 'romantic_relationship_start_time_v3';

export const RelationshipTimer: React.FC = () => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Check LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) {
          setStartTime(parsed);
        }
      }
    } catch (_) {}
  }, []);

  // Real-time ticking every second; starts when button is pressed and NEVER stops
  useEffect(() => {
    if (!startTime) {
      setElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const calculateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, now - startTime);

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Starts the count from 0-0-0-0 and saves to LocalStorage so it never stops
  const handleStartTimer = () => {
    const now = Date.now();
    setStartTime(now);
    try {
      localStorage.setItem(STORAGE_KEY, now.toString());
    } catch (_) {}
    romanticAudio.playUnlockSuccess();
  };

  const formatDateLabel = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full bg-[#FDFBF7] border border-[#EAD7D1] rounded-[2rem] p-5 sm:p-8 shadow-[0_12px_35px_rgba(184,58,75,0.06)] relative overflow-hidden text-center my-8">
      {/* Top Rose Gold Accent Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F7D6D9] via-[#D4AF37]/50 to-[#C8B6E2]" />

      <div className="max-w-xl mx-auto">
        {/* Header with Romantic Clock Icon */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0ED] border border-[#EED7D1] text-[#B83A4B] text-xs font-medium mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>Reloj de novios</span>
        </div>

        <h3 className="font-serif-title text-2xl sm:text-3xl text-[#2D1E1C] font-bold tracking-tight">
          Nuestro tiempo juntos
        </h3>
        <p className="font-script text-xl sm:text-2xl text-[#B83A4B] mt-1 mb-6">
          Cada segundo a tu lado cuenta como una eternidad
        </p>

        {/* 4 Counter Cards: Always visible in 0-0-0-0 until started, then ticking continuously */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Días */}
          <div className="bg-[#FAF2EF] border border-[#EFE1DC] rounded-2xl p-3.5 sm:p-4 shadow-sm hover:border-[#E2B7B0] transition-colors">
            <span className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#B83A4B] block tabular-nums">
              {elapsed.days}
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#7A6964] font-medium mt-1 block">
              {elapsed.days === 1 ? 'Día' : 'Días'}
            </span>
          </div>

          {/* Horas */}
          <div className="bg-[#FAF2EF] border border-[#EFE1DC] rounded-2xl p-3.5 sm:p-4 shadow-sm hover:border-[#E2B7B0] transition-colors">
            <span className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D1E1C] block tabular-nums">
              {String(elapsed.hours).padStart(2, '0')}
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#7A6964] font-medium mt-1 block">
              Horas
            </span>
          </div>

          {/* Minutos */}
          <div className="bg-[#FAF2EF] border border-[#EFE1DC] rounded-2xl p-3.5 sm:p-4 shadow-sm hover:border-[#E2B7B0] transition-colors">
            <span className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D1E1C] block tabular-nums">
              {String(elapsed.minutes).padStart(2, '0')}
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#7A6964] font-medium mt-1 block">
              Minutos
            </span>
          </div>

          {/* Segundos */}
          <div className="bg-[#FAF2EF] border border-[#EFE1DC] rounded-2xl p-3.5 sm:p-4 shadow-sm hover:border-[#E2B7B0] transition-colors relative overflow-hidden">
            <span
              className={`font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#B83A4B] block tabular-nums ${
                startTime ? 'animate-pulse' : ''
              }`}
            >
              {String(elapsed.seconds).padStart(2, '0')}
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#7A6964] font-medium mt-1 block">
              Segundos
            </span>
          </div>
        </div>

        {!startTime ? (
          /* Initial unactivated state showing 0-0-0-0 and the activation button */
          <div className="py-2 animate-fadeIn">
            <p className="text-xs sm:text-sm text-[#7A6964] max-w-md mx-auto mb-4 leading-relaxed font-body">
              Presiona el botón para dar inicio a nuestro reloj de novios.
              Una vez activado, este conteo comenzará a avanzar y <strong>más nunca se detendrá ni se reiniciará por nada en el mundo</strong>.
            </p>
            <button
              onClick={handleStartTimer}
              className="py-3 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-[#B83A4B] via-[#C44355] to-[#9E2A3B] hover:from-[#A53040] hover:to-[#8B2332] active:scale-[0.98] text-white text-sm sm:text-base font-semibold shadow-[0_6px_20px_rgba(184,58,75,0.25)] hover:shadow-[0_8px_25px_rgba(184,58,75,0.35)] transition-all flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white animate-pulse" />
              <span>Iniciar nuestro tiempo juntos</span>
              <Sparkles className="w-4 h-4 text-[#F7D6D9]" />
            </button>
          </div>
        ) : (
          /* Running state */
          <div className="pt-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#8C7A75] animate-fadeIn">
            <Calendar className="w-4 h-4 text-[#B83A4B]" />
            <span>
              Iniciado el <strong>{formatDateLabel(startTime)}</strong> · Conteo activo para siempre ♥
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
