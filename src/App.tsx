/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  CalendarHeart,
  Hourglass,
  MoonStar,
  PhoneCall,
  Waves,
  Feather,
  Compass,
  Home,
  HeartHandshake,
  ArrowRight,
  Edit3
} from 'lucide-react';
import { FloatingHearts } from './components/FloatingHearts';
import { MusicPlayer } from './components/MusicPlayer';
import { MemoryModal } from './components/MemoryModal';
import { PullToRevealSecret } from './components/PullToRevealSecret';
import { PolaroidAlbumModal } from './components/PolaroidAlbumModal';
import { RelationshipTimer } from './components/RelationshipTimer';
import { HeartFlurry } from './components/HeartFlurry';
import { SecretLetterModal } from './components/SecretLetterModal';
import { ALBUM_MEMORIES, AlbumMemory } from './data/albumData';
import { romanticAudio } from './utils/audio';

export default function App() {
  // Secret access state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showHeartFlurry, setShowHeartFlurry] = useState(false);

  // Selected memory modal state
  const [memories, setMemories] = useState<AlbumMemory[]>(() => {
    try {
      const saved = localStorage.getItem('romantic_custom_memories_text');
      if (saved) {
        const overrides: Record<number, { tenderMessage?: string; poeticNote?: string }> = JSON.parse(saved);
        return ALBUM_MEMORIES.map((m) =>
          overrides[m.id] ? { ...m, ...overrides[m.id] } : m
        );
      }
    } catch (_) {}
    return ALBUM_MEMORIES;
  });

  const [activeMemory, setActiveMemory] = useState<AlbumMemory | null>(null);
  const [activeMemoryIndex, setActiveMemoryIndex] = useState(0);
  const [startInEditMode, setStartInEditMode] = useState(false);

  // View style: 'cards' or 'list'
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // Key verification
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (passwordInput.trim() === '152314') {
      setErrorMessage('');
      setShowHeartFlurry(true);
      setIsUnlocked(true);
      romanticAudio.playUnlockSuccess();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMessage('Mmm, intenta de nuevo, mi amor');
      setIsShaking(true);
      romanticAudio.playErrorTender();
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const isMemoryCustomized = (memory: AlbumMemory) => {
    const orig = ALBUM_MEMORIES.find((o) => o.id === memory.id);
    if (!orig) return false;
    return orig.tenderMessage !== memory.tenderMessage || orig.poeticNote !== memory.poeticNote;
  };

  const openMemory = (memory: AlbumMemory, index: number, editMode = false) => {
    setActiveMemory(memory);
    setActiveMemoryIndex(index);
    setStartInEditMode(editMode);
  };

  const handleNextMemory = () => {
    const nextIdx = (activeMemoryIndex + 1) % memories.length;
    setActiveMemoryIndex(nextIdx);
    setActiveMemory(memories[nextIdx]);
  };

  const handlePrevMemory = () => {
    const prevIdx =
      (activeMemoryIndex - 1 + memories.length) % memories.length;
    setActiveMemoryIndex(prevIdx);
    setActiveMemory(memories[prevIdx]);
  };

  const handleUpdateMemory = (id: number, updatedTender: string, updatedPoetic: string) => {
    const updated = memories.map((m) =>
      m.id === id ? { ...m, tenderMessage: updatedTender, poeticNote: updatedPoetic } : m
    );
    setMemories(updated);

    try {
      const overrides: Record<number, { tenderMessage: string; poeticNote: string }> = {};
      updated.forEach((m) => {
        const orig = ALBUM_MEMORIES.find((o) => o.id === m.id);
        if (orig && (orig.tenderMessage !== m.tenderMessage || orig.poeticNote !== m.poeticNote)) {
          overrides[m.id] = { tenderMessage: m.tenderMessage, poeticNote: m.poeticNote };
        }
      });
      localStorage.setItem('romantic_custom_memories_text', JSON.stringify(overrides));
    } catch (_) {}

    if (activeMemory && activeMemory.id === id) {
      setActiveMemory({
        ...activeMemory,
        tenderMessage: updatedTender,
        poeticNote: updatedPoetic,
      });
    }
  };

  const handleResetMemory = (id: number) => {
    const orig = ALBUM_MEMORIES.find((o) => o.id === id);
    if (!orig) return;
    handleUpdateMemory(id, orig.tenderMessage, orig.poeticNote);
  };

  const handleRelock = () => {
    setIsUnlocked(false);
    setPasswordInput('');
    setErrorMessage('');
    romanticAudio.playTone(392, 0.4, 0.2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Icon helper
  const getMemoryIcon = (name: string) => {
    const props = { className: 'w-5 h-5 text-[#B83A4B]' };
    switch (name) {
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'CalendarHeart':
        return <CalendarHeart {...props} />;
      case 'Hourglass':
        return <Hourglass {...props} />;
      case 'MoonStar':
        return <MoonStar {...props} />;
      case 'PhoneCall':
        return <PhoneCall {...props} />;
      case 'Waves':
        return <Waves {...props} />;
      case 'Feather':
        return <Feather {...props} />;
      case 'KeyRound':
        return <KeyRound {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'HomeHeart':
        return <Home {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      default:
        return <Heart {...props} />;
    }
  };

  return (
    <PullToRevealSecret>
      <div className="min-h-screen bg-[#FAF6F0] text-[#4A3E3D] relative overflow-x-hidden flex flex-col justify-between selection:bg-[#F7D6D9] selection:text-[#8C2D3B]">
        {/* Floating Gentle Hearts Canvas */}
        <FloatingHearts />

        {/* Burst of Red, Pink, and Pastel Purple Hearts on unlock */}
        <HeartFlurry
          active={showHeartFlurry}
          onComplete={() => setShowHeartFlurry(false)}
        />

        {/* Top-Left Polaroid Album Button & "Tu Canción" Music Player:
            Only visible after unlocking the web application with the secret key */}
        {isUnlocked && (
          <>
            <div className="fixed top-3.5 sm:top-5 left-3.5 sm:left-5 z-40 animate-fadeIn">
              <PolaroidAlbumModal />
            </div>

            <div className="animate-fadeIn">
              <MusicPlayer />
            </div>
          </>
        )}

        {/* Main Content Container with mobile-first padding */}
        <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-8 sm:py-16 flex-grow flex flex-col items-center justify-center">
        {!isUnlocked ? (
          /* ======================================================== */
          /* SECCIÓN 1: PANTALLA DE INICIO Y ACCESO POR CLAVE        */
          /* ======================================================== */
          <div className="w-full max-w-md sm:max-w-lg mx-auto transition-all duration-700 ease-out">
            <div className="bg-[#FDFBF7]/95 backdrop-blur-md border border-[#EAD7D1] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 shadow-[0_15px_40px_rgba(184,58,75,0.08)] text-center relative overflow-hidden">
              {/* Subtle top rose gold light bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F7D6D9] via-[#D4AF37]/50 to-[#F7D6D9]" />

              {/* Romantic Kicker */}
              <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                <span className="h-px w-6 sm:w-8 bg-[#D4AF37]/40" />
                <span className="font-script text-xl sm:text-3xl text-[#B83A4B] leading-none">
                  Para mi niña consentida
                </span>
                <span className="h-px w-6 sm:w-8 bg-[#D4AF37]/40" />
              </div>

              {/* Heart Badge */}
              <div className="relative inline-flex items-center justify-center mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FAF0ED] border border-[#F0D5CF] flex items-center justify-center shadow-inner animate-float-gentle">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-[#B83A4B]/80 text-[#B83A4B] animate-pulse-subtle" />
                </div>
                <div className="absolute -top-1 -right-1 text-sm sm:text-base">✨</div>
              </div>

              {/* REQUISITO 2: MENSAJE PRINCIPAL EXACTO */}
              <h1 className="font-serif-title text-2xl sm:text-4xl lg:text-[2.6rem] text-[#2D1E1C] font-bold tracking-tight leading-snug sm:leading-tight mb-3 sm:mb-4 px-1 break-words">
                Gracias por decir que si mi niña
              </h1>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-2.5 my-4 sm:my-5">
                <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
                <span className="text-[#B83A4B] text-[11px] sm:text-xs">♥ ♥ ♥</span>
                <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
              </div>

              {/* Romantic Description without mentioning "secreto" */}
              <p className="text-xs sm:text-base text-[#7A6964] font-body leading-relaxed max-w-md mx-auto mb-6 sm:mb-8 px-2">
                Aquí guardo con todo mi amor los momentos más hermosos e inolvidables que hemos compartido juntos.
                Introduce nuestra clave para abrir nuestro álbum:
              </p>

              {/* REQUISITO 3: SECCIÓN DE ACCESO POR CLAVE */}
              <form
                onSubmit={handleUnlock}
                className={`space-y-3.5 sm:space-y-4 max-w-sm mx-auto transition-transform ${
                  isShaking ? 'translate-x-[-6px]' : ''
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A8928D]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Introduce la clave..."
                    className="w-full min-h-[48px] pl-10 pr-10 py-3 sm:py-3.5 bg-white border border-[#E2CCC5] focus:border-[#B83A4B] focus:ring-4 focus:ring-[#B83A4B]/10 rounded-2xl text-sm sm:text-base font-medium text-[#3A2A28] placeholder-[#B5A49F] outline-none transition-all shadow-inner text-center tracking-widest"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#A8928D] hover:text-[#B83A4B] transition-colors p-2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B83A4B] via-[#C44355] to-[#9E2A3B] hover:from-[#A53040] hover:to-[#8B2332] active:scale-[0.98] text-white text-sm sm:text-base font-semibold tracking-wide shadow-[0_8px_20px_rgba(184,58,75,0.25)] hover:shadow-[0_10px_25px_rgba(184,58,75,0.35)] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Unlock className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  <span>Abrir nuestro álbum</span>
                </button>

                {/* Tender error message if incorrect */}
                {errorMessage && (
                  <div className="p-3 bg-[#FDF0F2] border border-[#F5D3D8] rounded-2xl text-xs sm:text-sm font-medium text-[#B83A4B] flex items-center justify-center gap-2 animate-bounce">
                    <Heart className="w-3.5 h-3.5 fill-[#B83A4B] shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>

              {/* Gentle hint */}
              <div className="mt-6 sm:mt-8 pt-5 border-t border-[#F0E3DF] text-xs text-[#A8928D]">
                <span>Nuestra combinación especial guardada en el corazón</span>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* REQUISITO 4: MENÚ "NUESTRO PRIMER ÁLBUM" (SECCIÓN PROTEGIDA) */
          /* ======================================================== */
          <div className="w-full transition-all duration-700 ease-out animate-fadeIn pb-16">
            {/* Top Album Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0ED] border border-[#EED7D1] text-[#B83A4B] text-[11px] sm:text-xs font-medium mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nuestra colección de recuerdos</span>
              </div>

              {/* REQUISITO 4: TÍTULO EXACTO */}
              <h2 className="font-serif-title text-2xl sm:text-4xl md:text-5xl font-bold text-[#2D1E1C] tracking-tight">
                Nuestro primer álbum
              </h2>

              <p className="font-script text-xl sm:text-3xl text-[#B83A4B] mt-1 sm:mt-2">
                11 instantes que guardaré por siempre
              </p>

              {/* Pinterest-like Filter / View Switcher */}
              <div className="flex items-center justify-center gap-3 mt-4 sm:mt-6">
                <div className="bg-[#F3EBE6] p-1 rounded-xl flex items-center gap-1 border border-[#E8DCD6]">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'cards'
                        ? 'bg-white text-[#3A2A28] shadow-sm'
                        : 'text-[#7A6964] hover:text-[#3A2A28]'
                    }`}
                  >
                    Estilo Álbum
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-[#3A2A28] shadow-sm'
                        : 'text-[#7A6964] hover:text-[#3A2A28]'
                    }`}
                  >
                    Lista Elegante
                  </button>
                </div>
              </div>

              {/* RELOJ DE NOVIOS (CONTADOR DE TIEMPO JUNTOS) */}
              <RelationshipTimer />
            </div>

            {/* 11 ELEMENTOS INTERACTIVOS EN ORDEN EXACTO */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                {memories.map((memory, index) => (
                  <button
                    key={memory.id}
                    onClick={() => openMemory(memory, index)}
                    className="group bg-[#FDFBF7] hover:bg-white border border-[#EAD7D1] hover:border-[#E2B7B0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1 shadow-sm hover:shadow-[0_16px_30px_rgba(184,58,75,0.08)] relative overflow-hidden flex flex-col justify-between cursor-pointer"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F7D6D9] via-[#D4AF37] to-[#F7D6D9] opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Top icon and number */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FAF0ED] group-hover:bg-[#FCECE8] border border-[#F0D5CF] flex items-center justify-center transition-colors">
                          {getMemoryIcon(memory.iconName)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isMemoryCustomized(memory) && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF0ED] text-[#B83A4B] border border-[#F0D5CF] font-medium flex items-center gap-1 shadow-xs">
                              <span>✨</span> Editada
                            </span>
                          )}
                          <span className="text-[11px] font-mono tracking-wider text-[#A8928D] group-hover:text-[#B83A4B] font-semibold">
                            0{memory.id < 10 ? `0${memory.id}`.slice(-2) : memory.id}
                          </span>
                        </div>
                      </div>

                      {/* Tagline */}
                      <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[#9C827B] block mb-0.5 sm:mb-1">
                        {memory.tagline}
                      </span>

                      {/* EXACT REQUIRED TEXT */}
                      <h3 className="font-serif-title text-lg sm:text-xl text-[#3A2A28] font-bold group-hover:text-[#8C2D3B] transition-colors leading-snug">
                        {memory.itemText}
                      </h3>
                    </div>

                    {/* Bottom tender preview */}
                    <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-[#F2E5E1] flex items-center justify-between gap-2">
                      <span className="text-xs text-[#8C7A75] italic line-clamp-1 group-hover:text-[#B83A4B] transition-colors flex-1">
                        "{memory.tenderMessage}"
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMemory(memory, index, true);
                          }}
                          className="p-1.5 rounded-lg text-[#A8928D] hover:text-[#B83A4B] hover:bg-[#FAF0ED] transition-colors cursor-pointer"
                          title="Editar texto de esta carta"
                          aria-label="Editar texto de esta carta"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <ArrowRight className="w-4 h-4 text-[#C4B0AB] group-hover:text-[#B83A4B] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Minimalist List view for mobile and desktop */
              <div className="space-y-2.5 sm:space-y-3 max-w-2xl mx-auto">
                {memories.map((memory, index) => (
                  <button
                    key={memory.id}
                    onClick={() => openMemory(memory, index)}
                    className="w-full bg-[#FDFBF7] hover:bg-white border border-[#EAD7D1] hover:border-[#E2B7B0] rounded-xl sm:rounded-2xl p-3 sm:p-4 sm:px-6 flex items-center justify-between transition-all duration-200 active:scale-[0.99] shadow-sm hover:shadow-md group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FAF0ED] border border-[#F0D5CF] flex items-center justify-center shrink-0">
                        {getMemoryIcon(memory.iconName)}
                      </div>
                      <div className="truncate">
                        {/* EXACT REQUIRED TEXT */}
                        <div className="font-serif-title text-base sm:text-lg font-bold text-[#3A2A28] group-hover:text-[#8C2D3B] transition-colors truncate">
                          {memory.itemText}
                        </div>
                        <div className="text-[11px] sm:text-xs text-[#8C7A75] truncate">
                          {memory.tagline} · <span className="italic text-[#B83A4B]">Tocar para ver</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {isMemoryCustomized(memory) && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FAF0ED] text-[#B83A4B] border border-[#F0D5CF] font-medium hidden sm:inline-flex">
                          ✨ Editada
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openMemory(memory, index, true);
                        }}
                        className="p-1.5 rounded-lg text-[#A8928D] hover:text-[#B83A4B] hover:bg-[#FAF0ED] transition-colors cursor-pointer"
                        title="Editar texto de esta carta"
                        aria-label="Editar texto de esta carta"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <ArrowRight className="w-4 h-4 text-[#C4B0AB] group-hover:text-[#B83A4B] group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Romantic Dedication & Relock Option */}
            <div className="mt-12 sm:mt-16 bg-[#FDFBF7] border border-[#EAD7D1] rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FAF0ED] border border-[#F0D5CF] flex items-center justify-center mx-auto mb-3">
                <Heart className="w-5 h-5 fill-[#B83A4B] text-[#B83A4B]" />
              </div>
              <h4 className="font-serif-title text-lg sm:text-xl text-[#2D1E1C] font-bold mb-2">
                "Gracias por existir en mi vida"
              </h4>
              <p className="font-cormorant italic text-base sm:text-xl text-[#5A4843] leading-relaxed max-w-lg mx-auto mb-5">
                Cada uno de estos 11 momentos es un pedacito de la felicidad más pura que he sentido. 
                Eres mi niña bonita, hoy y siempre.
              </p>

              <div className="pt-4 border-t border-[#F0E3DF] flex items-center justify-center">
                <button
                  onClick={handleRelock}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#7A6964] hover:text-[#B83A4B] hover:bg-[#FAF0ED] rounded-xl transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Volver a bloquear álbum</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Romantic Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-[#8C7A75] border-t border-[#EFE5E0] bg-[#FAF6F0]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p className="font-serif">
            Hecho con todo mi amor para ti · Siempre juntos ♥
          </p>
          <SecretLetterModal />
        </div>
      </footer>

      {/* Pop-up Memory Modal with Text Editing Support */}
      <MemoryModal
        memory={activeMemory}
        onClose={() => setActiveMemory(null)}
        onNext={handleNextMemory}
        onPrev={handlePrevMemory}
        currentIndex={activeMemoryIndex}
        total={memories.length}
        onUpdateMemory={handleUpdateMemory}
        onResetMemory={handleResetMemory}
        startInEditMode={startInEditMode}
      />
      </div>
    </PullToRevealSecret>
  );
}
