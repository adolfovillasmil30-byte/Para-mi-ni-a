import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Music,
  X,
  Heart,
  Volume2,
  Mic,
  Sparkles,
  Check,
  Radio,
  ArrowLeft
} from 'lucide-react';
import { getVoiceNoteAudio, saveVoiceNoteAudio } from '../utils/audioStorage';
import { romanticAudio } from '../utils/audio';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const MusicPlayer: React.FC = () => {
  // YouTube player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Secret voice note mode state
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);
  const lastClickTimeRef = useRef(0);

  // Voice note audio state
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voiceCurrentTime, setVoiceCurrentTime] = useState(0);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const VIDEO_ID = 'baQQVI2M7Ts'; // "Especial" - Eladio Carrión
  const COVER_URL = 'https://i.ytimg.com/vi/baQQVI2M7Ts/hqdefault.jpg';

  // Load custom voice note from IndexedDB on mount
  useEffect(() => {
    getVoiceNoteAudio().then((data) => {
      if (data) {
        setVoiceAudioUrl(data);
      }
    });
  }, []);

  // Initialize YouTube Iframe API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && iframeRef.current) {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: () => {
              setIsReady(true);
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Pause only when user leaves the tab / site
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying) pauseAudio();
        if (voiceAudioRef.current && !voiceAudioRef.current.paused) {
          voiceAudioRef.current.pause();
          setIsVoicePlaying(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  const sendCommand = (func: string, args: any[] = []) => {
    if (playerRef.current && typeof playerRef.current[func] === 'function') {
      try {
        playerRef.current[func](...args);
        return;
      } catch (err) {}
    }
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  };

  const playAudio = () => {
    if (isVoicePlaying && voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      setIsVoicePlaying(false);
    }
    sendCommand('playVideo');
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    sendCommand('pauseVideo');
    setIsPlaying(false);
  };

  const restartAudio = () => {
    sendCommand('seekTo', [0, true]);
    sendCommand('playVideo');
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  // RITUAL SECRETO: 3 CLICS SEGUIDOS SOBRE "Especial"
  const handleTitleClick = () => {
    const now = Date.now();
    if (now - lastClickTimeRef.current > 1500) {
      setSecretClickCount(1);
    } else {
      const newCount = secretClickCount + 1;
      setSecretClickCount(newCount);

      if (newCount >= 3) {
        // ACTIVAR MODO SECRETO
        setSecretClickCount(0);
        setIsSecretMode(true);
        romanticAudio.playUnlockSuccess();
        // Pause background song when voice note mode starts
        pauseAudio();
        if (voiceAudioRef.current) {
          voiceAudioRef.current.currentTime = 0;
          voiceAudioRef.current.play().catch(() => {});
          setIsVoicePlaying(true);
        }
      }
    }
    lastClickTimeRef.current = now;
  };

  // RESTABLECIMIENTO AUTOMÁTICO AL CERRAR:
  // Al cerrar el modal, siempre regresa a "Especial"
  const handleCloseModal = () => {
    if (voiceAudioRef.current && !voiceAudioRef.current.paused) {
      voiceAudioRef.current.pause();
      setIsVoicePlaying(false);
    }
    setIsSecretMode(false);
    setSecretClickCount(0);
    setIsModalOpen(false);
  };

  // Handle Voice Note File Upload
  const handleVoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const savedUrl = await saveVoiceNoteAudio(file);
      setVoiceAudioUrl(savedUrl);
      setUploadSuccessMsg('¡Nota de voz guardada!');
      romanticAudio.playChime();
      setTimeout(() => setUploadSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error al guardar nota de voz', err);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Voice Note Play / Pause / Seek
  const toggleVoicePlay = () => {
    if (!voiceAudioRef.current) return;
    if (isVoicePlaying) {
      voiceAudioRef.current.pause();
      setIsVoicePlaying(false);
    } else {
      voiceAudioRef.current.play().catch(() => {});
      setIsVoicePlaying(true);
    }
  };

  const restartVoice = () => {
    if (!voiceAudioRef.current) return;
    voiceAudioRef.current.currentTime = 0;
    voiceAudioRef.current.play().catch(() => {});
    setIsVoicePlaying(true);
  };

  const handleVoiceTimeUpdate = () => {
    if (!voiceAudioRef.current) return;
    const cur = voiceAudioRef.current.currentTime;
    const dur = voiceAudioRef.current.duration || 0;
    setVoiceCurrentTime(cur);
    setVoiceDuration(dur);
    setVoiceProgress(dur > 0 ? (cur / dur) * 100 : 0);
  };

  const handleSeekVoice = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!voiceAudioRef.current) return;
    const seekPercent = parseFloat(e.target.value);
    const newTime = (seekPercent / 100) * (voiceAudioRef.current.duration || 0);
    voiceAudioRef.current.currentTime = newTime;
    setVoiceProgress(seekPercent);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Hidden YouTube Audio Stream */}
      <iframe
        ref={iframeRef}
        id="youtube-audio-stream"
        src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?enablejsapi=1&playsinline=1&controls=0&rel=0&modestbranding=1&origin=${encodeURIComponent(
          typeof window !== 'undefined' ? window.location.origin : ''
        )}`}
        allow="autoplay; encrypted-media"
        title="Audio Stream Especial Eladio Carrion"
        className="absolute -top-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Hidden HTML5 Audio Element for the Custom Voice Note */}
      {voiceAudioUrl && (
        <audio
          ref={voiceAudioRef}
          src={voiceAudioUrl}
          onTimeUpdate={handleVoiceTimeUpdate}
          onEnded={() => setIsVoicePlaying(false)}
          onLoadedMetadata={handleVoiceTimeUpdate}
          className="hidden"
        />
      )}

      {/* Hidden File Input for uploading .mp3 / .m4a / .wav voice note */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/m4a,audio/wav,audio/*"
        onChange={handleVoiceUpload}
        className="hidden"
      />

      {/* 
        BOTÓN EN LA ESQUINA: "tu canción"
      */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => {
            // Opening always guarantees reset to normal state
            setIsSecretMode(false);
            setSecretClickCount(0);
            setIsModalOpen(true);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 shadow-sm backdrop-blur-md cursor-pointer ${
            isPlaying || isVoicePlaying
              ? 'bg-[#F7EBE8]/95 border-[#E2B7B0] text-[#8C2D3B] ring-2 ring-[#B83A4B]/20 shadow-[0_4px_16px_rgba(184,58,75,0.18)]'
              : 'bg-white/95 border-[#EAD7D1] text-[#6E5D58] hover:bg-[#FAF0ED] hover:text-[#8C2D3B]'
          }`}
          aria-label="Abrir reproductor de tu canción"
        >
          <div className="relative flex items-center justify-center">
            <Music
              className={`w-4 h-4 text-[#B83A4B] transition-transform ${
                isPlaying || isVoicePlaying ? 'animate-bounce' : ''
              }`}
            />
            {(isPlaying || isVoicePlaying) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B83A4B] animate-ping" />
            )}
          </div>
          <span className="text-xs sm:text-sm font-serif-title font-medium tracking-wide">
            tu canción
          </span>
          {(isPlaying || isVoicePlaying) && (
            <span className="flex items-center gap-0.5 ml-0.5">
              <span className="w-0.5 h-2.5 bg-[#B83A4B] rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
              <span className="w-0.5 h-3.5 bg-[#B83A4B] rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.2s]" />
              <span className="w-0.5 h-2 bg-[#B83A4B] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s]" />
            </span>
          )}
        </button>
      </div>

      {/* 
        MODAL DEL REPRODUCTOR (PORTAL DIRECTO A DOCUMENT.BODY)
        Garantiza posición fija en el centro absoluto del viewport sin importar el scroll
      */}
      {isModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2B1B17]/45 backdrop-blur-md transition-all duration-300"
            onClick={handleCloseModal}
          >
            <div
              className="relative w-full max-w-sm bg-[#FDFBF7] rounded-[2.25rem] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-[#EAD7D1] p-6 sm:p-7 text-center overflow-hidden animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Accent Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r transition-all duration-500 ${
                  isSecretMode
                    ? 'from-[#B83A4B] via-[#E29578] to-[#B83A4B]'
                    : 'from-[#F7D6D9] via-[#D4AF37]/60 to-[#F7D6D9]'
                }`}
              />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0E3DF]">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B83A4B] font-semibold">
                  {isSecretMode ? (
                    <>
                      <Mic className="w-3.5 h-3.5 text-[#B83A4B] animate-pulse" />
                      <span>Nota de Voz Secreta</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-3.5 h-3.5 fill-[#B83A4B]" />
                      <span>Nuestra canción</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Discreet Admin Button to upload/change Voice Note */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Subir o cambiar nota de voz personal (.mp3, .m4a)"
                    className="p-1.5 rounded-full text-[#A8928D] hover:text-[#B83A4B] hover:bg-[#FAF0ED] transition-colors cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Close Button: closes modal and resets to normal state */}
                  <button
                    onClick={handleCloseModal}
                    title="Cerrar reproductor"
                    className="p-1.5 rounded-full text-[#8C7A75] hover:bg-[#FAF0ED] hover:text-[#4A3E3D] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Upload Success Toast notification */}
              {uploadSuccessMsg && (
                <div className="mb-3 py-1.5 px-3 bg-[#EAF5EC] border border-[#C5E5CB] text-[#2D6A4F] text-xs rounded-xl flex items-center justify-center gap-1.5 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              {/* ======================================================= */}
              {/* VISTA 1: MODO SECRETO (NOTA DE VOZ PERSONAL DE MIVI)    */}
              {/* ======================================================= */}
              {isSecretMode ? (
                <div className="animate-fadeIn">
                  {/* Voice Note Centerpiece Artwork */}
                  <div className="relative mx-auto my-3 w-48 h-48 sm:w-52 sm:h-52 rounded-full p-2 bg-[#FAF0ED] border-2 border-[#E2B7B0] shadow-xl flex items-center justify-center">
                    <div
                      className={`w-full h-full rounded-full bg-gradient-to-br from-[#F7EBE8] via-[#FAF0ED] to-[#F3D5D8] flex flex-col items-center justify-center border border-[#D4AF37]/40 shadow-inner ${
                        isVoicePlaying ? 'animate-pulse' : ''
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full bg-[#B83A4B]/10 border border-[#B83A4B]/30 flex items-center justify-center mb-2">
                        <Mic className="w-8 h-8 text-[#B83A4B]" />
                      </div>
                      <span className="font-script text-xl text-[#B83A4B]">
                        Para ti mi niña
                      </span>
                    </div>

                    <div className="absolute bottom-1 right-2 w-8 h-8 rounded-full bg-white border border-[#EAD7D1] shadow-md flex items-center justify-center">
                      <Heart className="w-4 h-4 fill-[#B83A4B] text-[#B83A4B]" />
                    </div>
                  </div>

                  {/* Title & Subtitle for Voice Note */}
                  <div className="mt-4 mb-4">
                    <h3 className="font-serif-title text-xl sm:text-2xl text-[#2D1E1C] font-bold tracking-tight">
                      Mensaje secreto de Mivi 🎙️
                    </h3>
                    <p className="font-script text-lg text-[#B83A4B] mt-0.5">
                      "Escucha lo que guardo para ti..."
                    </p>
                  </div>

                  {/* Audio Seek Bar */}
                  <div className="px-3 mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={voiceProgress}
                      onChange={handleSeekVoice}
                      className="w-full h-1.5 bg-[#EAD7D1] rounded-lg appearance-none cursor-pointer accent-[#B83A4B]"
                    />
                    <div className="flex justify-between text-[10px] text-[#8C7A75] mt-1 font-mono">
                      <span>{formatTime(voiceCurrentTime)}</span>
                      <span>{formatTime(voiceDuration)}</span>
                    </div>
                  </div>

                  {/* Voice Controls: Restart & Play/Pause */}
                  <div className="flex items-center justify-center gap-5 my-3">
                    <button
                      onClick={restartVoice}
                      title="Reiniciar nota de voz"
                      className="w-12 h-12 rounded-full bg-[#FAF0ED] hover:bg-[#F7E3E5] border border-[#EAD7D1] text-[#6E5D58] hover:text-[#B83A4B] flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                      onClick={toggleVoicePlay}
                      title={isVoicePlaying ? 'Pausar nota de voz' : 'Escuchar nota de voz'}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-[#B83A4B] via-[#C44355] to-[#9E2A3B] hover:from-[#A53040] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(184,58,75,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      {isVoicePlaying ? (
                        <Pause className="w-7 h-7 fill-white" />
                      ) : (
                        <Play className="w-7 h-7 fill-white ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Back to Normal Song Switch */}
                  <div className="mt-4 pt-3 border-t border-[#F0E3DF] flex items-center justify-between text-[11px] text-[#8C7A75]">
                    <button
                      onClick={() => {
                        if (voiceAudioRef.current) voiceAudioRef.current.pause();
                        setIsVoicePlaying(false);
                        setIsSecretMode(false);
                      }}
                      className="text-[#B83A4B] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Volver a la canción</span>
                    </button>

                    <span className="text-[10px] text-[#A8928D]">
                      Se restablece al cerrar
                    </span>
                  </div>
                </div>
              ) : (
                /* ======================================================= */
                /* VISTA NORMAL: "ESPECIAL" - ELADIO CARRIÓN              */
                /* ======================================================= */
                <div>
                  {/* Official Song Cover Art */}
                  <div className="relative mx-auto my-3 w-48 h-48 sm:w-52 sm:h-52 rounded-full p-2 bg-[#FAF0ED] border-2 border-[#EAD7D1] shadow-xl flex items-center justify-center group">
                    <div
                      className={`w-full h-full rounded-full overflow-hidden relative shadow-inner border border-[#D4AF37]/40 ${
                        isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
                      }`}
                    >
                      <img
                        src={COVER_URL}
                        alt="Carátula Especial - Eladio Carrión"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23FAF0ED"/><circle cx="150" cy="150" r="80" fill="%23B83A4B"/><text x="150" y="160" font-size="30" text-anchor="middle" fill="white">♥</text></svg>';
                        }}
                      />
                      <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-[#FDFBF7] border-2 border-[#D4AF37] flex items-center justify-center shadow">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#B83A4B]" />
                      </div>
                    </div>

                    <div className="absolute bottom-1 right-2 w-8 h-8 rounded-full bg-white border border-[#EAD7D1] shadow-md flex items-center justify-center">
                      <Heart className="w-4 h-4 fill-[#B83A4B] text-[#B83A4B]" />
                    </div>
                  </div>

                  {/* Song Meta Information (RITUAL: TOCAR 3 VECES "Especial") */}
                  <div className="mt-4 mb-5">
                    <h3
                      onClick={handleTitleClick}
                      title="Toca 3 veces para un secreto..."
                      className="font-serif-title text-2xl text-[#2D1E1C] font-bold tracking-tight cursor-pointer select-none hover:text-[#B83A4B] transition-colors inline-block"
                    >
                      Especial
                    </h3>
                    <p className="text-sm font-medium text-[#8C7A75] mt-0.5">
                      Eladio Carrión
                    </p>
                    <p className="font-script text-xl text-[#B83A4B] mt-1">
                      "Tú eres especial mi niña..."
                    </p>
                  </div>

                  {/* Song Audio Controls */}
                  <div className="flex items-center justify-center gap-5 my-4">
                    <button
                      onClick={restartAudio}
                      title="Reiniciar canción desde el principio"
                      className="w-12 h-12 rounded-full bg-[#FAF0ED] hover:bg-[#F7E3E5] border border-[#EAD7D1] text-[#6E5D58] hover:text-[#B83A4B] flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                      onClick={togglePlay}
                      title={isPlaying ? 'Pausar canción' : 'Reproducir canción'}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-[#B83A4B] via-[#C44355] to-[#9E2A3B] hover:from-[#A53040] hover:to-[#8B2332] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(184,58,75,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-7 h-7 fill-white" />
                      ) : (
                        <Play className="w-7 h-7 fill-white ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Footer explanation */}
                  <div className="mt-4 pt-3 border-t border-[#F0E3DF] text-[11px] text-[#8C7A75] leading-relaxed">
                    <span className="flex items-center justify-center gap-1.5 font-medium text-[#B83A4B]">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>La música seguirá sonando al cerrar</span>
                    </span>
                    <p className="text-[10px] text-[#A8928D] mt-0.5">
                      Toca la 'X' o fuera del cuadro para cerrar sin mover la página.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
