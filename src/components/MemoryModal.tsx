import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CalendarHeart,
  Hourglass,
  MoonStar,
  PhoneCall,
  Waves,
  Feather,
  KeyRound,
  Compass,
  Home,
  Share2,
  Check,
  Edit3,
  RotateCcw
} from 'lucide-react';
import { AlbumMemory, ALBUM_MEMORIES } from '../data/albumData';
import { romanticAudio } from '../utils/audio';

interface MemoryModalProps {
  memory: AlbumMemory | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  total: number;
  onUpdateMemory?: (id: number, updatedTender: string, updatedPoetic: string) => void;
  onResetMemory?: (id: number) => void;
  startInEditMode?: boolean;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  total,
  onUpdateMemory,
  onResetMemory,
  startInEditMode = false,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable text state for this specific card
  const [editTender, setEditTender] = useState('');
  const [editPoetic, setEditPoetic] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    if (memory) {
      romanticAudio.playChime();
      setIsFavorited(false);
      setCopied(false);
      setIsEditing(startInEditMode);
      setEditTender(memory.tenderMessage);
      setEditPoetic(memory.poeticNote);
    }
  }, [memory, startInEditMode]);

  if (!memory) return null;

  // Icon mapping
  const renderIcon = (name: string) => {
    const props = { className: "w-5 h-5 text-[#B83A4B]" };
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
      default:
        return <Heart {...props} />;
    }
  };

  const handleCopy = () => {
    const textToCopy = `"${memory.itemText}" — ${memory.tenderMessage} "${memory.poeticNote}"`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    romanticAudio.playTone(880, 0.4, 0.2);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateMemory && memory) {
      onUpdateMemory(memory.id, editTender.trim(), editPoetic.trim());
      setIsEditing(false);
      setSaveToast(true);
      romanticAudio.playTone(1046.5, 0.5, 0.3);
      setTimeout(() => setSaveToast(false), 2500);
    }
  };

  const handleReset = () => {
    if (onResetMemory && memory) {
      onResetMemory(memory.id);
      setIsEditing(false);
      romanticAudio.playTone(440, 0.3, 0.2);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-[#2B1B17]/50 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#FDFBF7] rounded-[1.75rem] sm:rounded-3xl shadow-2xl border border-[#EAD7D1] transform transition-all duration-300 scale-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Ribbon */}
        <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-[#F7D6D9] via-[#E8B4B8] to-[#D4AF37]/60 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2 text-xs text-[#8C7A75] tracking-widest uppercase font-medium">
            <span className="text-[#B83A4B]">Capítulo {currentIndex + 1}</span>
            <span>·</span>
            <span>de {total}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Edit Button */}
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (!isEditing) {
                  setEditTender(memory.tenderMessage);
                  setEditPoetic(memory.poeticNote);
                }
              }}
              title={isEditing ? "Cancelar edición" : "Editar texto de esta carta"}
              className={`p-2 rounded-full transition-colors flex items-center gap-1 ${
                isEditing
                  ? "bg-[#FAF0ED] text-[#B83A4B] font-semibold text-xs"
                  : "hover:bg-[#F7EBE8] text-[#8C7A75] hover:text-[#B83A4B]"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-[11px] hidden xs:inline">{isEditing ? "Editando" : "Editar"}</span>
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => {
                setIsFavorited(!isFavorited);
                romanticAudio.playTone(isFavorited ? 440 : 1046.5, 0.5, 0.25);
              }}
              title={isFavorited ? "Guardado en el corazón" : "Guardar como favorito"}
              className="p-2 rounded-full hover:bg-[#F7EBE8] text-[#8C7A75] transition-colors"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  isFavorited
                    ? "fill-[#B83A4B] text-[#B83A4B] scale-110"
                    : "hover:text-[#B83A4B]"
                }`}
              />
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              title="Copiar recuerdo"
              className="p-2 rounded-full hover:bg-[#F7EBE8] text-[#8C7A75] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" /> : <Share2 className="w-4 h-4 sm:w-5 sm:h-5 hover:text-[#B83A4B]" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Cerrar recuerdo"
              className="p-2 rounded-full hover:bg-[#F7EBE8] text-[#8C7A75] hover:text-[#4A3E3D] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Success Toast */}
        {saveToast && (
          <div className="mx-6 mb-2 py-1.5 px-3 bg-[#EAF5EC] border border-[#C5E5CB] text-[#2D6A4F] text-xs rounded-xl flex items-center justify-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>¡Texto de la carta guardado para siempre! ♥</span>
          </div>
        )}

        {/* Modal Content */}
        <div className="px-6 sm:px-8 py-3 sm:py-4">
          {/* Romantic Badge Icon */}
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF0ED] border border-[#F0D5CF] flex items-center justify-center shadow-inner mb-3">
            {renderIcon(memory.iconName)}
          </div>

          {/* Item Text & Subtitle */}
          <div className="text-center mb-4">
            <span className="inline-block text-xs uppercase tracking-widest text-[#B83A4B] font-semibold mb-1">
              {memory.tagline}
            </span>
            <h3 className="font-serif-title text-2xl sm:text-3xl text-[#3A2A28] font-bold tracking-tight">
              {memory.itemText}
            </h3>
            <div className="w-12 h-0.5 bg-[#D4AF37]/50 mx-auto mt-2.5 rounded-full" />
          </div>

          {/* 
            CARTA / TARJETA EDITABLE O MODO LECTURA
            Matches the user's uploaded screenshot with editable inputs
          */}
          {(() => {
            const originalMemory = ALBUM_MEMORIES.find((o) => o.id === memory.id);
            const isCustomized = originalMemory && (originalMemory.tenderMessage !== memory.tenderMessage || originalMemory.poeticNote !== memory.poeticNote);

            if (isEditing) {
              return (
                /* MODO EDICIÓN */
                <form onSubmit={handleSaveEdit} className="bg-[#FAF3F0] rounded-2xl p-4 sm:p-5 border-2 border-[#E2B7B0] mb-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EAD7D1]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-[#FAF0ED] border border-[#F0D5CF] flex items-center justify-center text-[#B83A4B]">
                        <Edit3 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#8B3A45]">
                        Personalizar texto de esta carta
                      </span>
                    </div>

                    {onResetMemory && isCustomized && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-[11px] text-[#8C7A75] hover:text-[#B83A4B] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Restablecer al texto original"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restablecer original</span>
                      </button>
                    )}
                  </div>

                  {/* Input 1: Mensaje tierno */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-[#7A6964] flex items-center gap-1">
                        <span>💌</span> Frase destacada (en negrita):
                      </label>
                      <span className="text-[10px] text-[#A8928D]">{editTender.length} carácteres</span>
                    </div>
                    <textarea
                      value={editTender}
                      onChange={(e) => setEditTender(e.target.value)}
                      rows={3}
                      className="w-full p-3 text-sm font-semibold text-[#8B3A45] bg-white border border-[#E8D0CB] focus:border-[#B83A4B] focus:ring-2 focus:ring-[#B83A4B]/15 rounded-xl outline-none font-body leading-snug resize-none shadow-inner"
                      placeholder="Escribe la frase principal o recuerdo inolvidable..."
                      required
                    />
                  </div>

                  {/* Input 2: Nota poética */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-[#7A6964] flex items-center gap-1">
                        <span>✍️</span> Dedicatoria poética (en cursiva):
                      </label>
                      <span className="text-[10px] text-[#A8928D]">{editPoetic.length} carácteres</span>
                    </div>
                    <textarea
                      value={editPoetic}
                      onChange={(e) => setEditPoetic(e.target.value)}
                      rows={4}
                      className="w-full p-3 text-base sm:text-lg font-cormorant italic text-[#4A3E3D] bg-white border border-[#E8D0CB] focus:border-[#B83A4B] focus:ring-2 focus:ring-[#B83A4B]/15 rounded-xl outline-none leading-relaxed resize-none shadow-inner"
                      placeholder="Escribe lo que sientes en tu corazón..."
                      required
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#EAD7D1]">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#7A6964] hover:bg-[#EFE5E0] transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="min-h-[38px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#B83A4B] via-[#C44355] to-[#9E2A3B] hover:from-[#A53040] hover:to-[#8B2332] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_12px_rgba(184,58,75,0.25)] flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Guardar texto para siempre ♥</span>
                    </button>
                  </div>
                </form>
              );
            }

            return (
              /* MODO VISTA (Exact visual match to user screenshot) */
              <div className="bg-[#FAF3F0] rounded-2xl p-4 sm:p-5 border border-[#EFE1DC] hover:border-[#E2B7B0] mb-4 shadow-sm transition-all group">
                <div className="flex items-start gap-3">
                  <span className="text-xl select-none mt-0.5">💌</span>
                  <div className="flex-1 pr-1">
                    <p className="text-sm sm:text-base font-semibold text-[#8B3A45] mb-2 font-body leading-snug">
                      {memory.tenderMessage}
                    </p>
                    <p className="font-cormorant italic text-lg sm:text-xl text-[#4A3E3D] leading-relaxed">
                      "{memory.poeticNote}"
                    </p>
                  </div>
                </div>

                {/* Bottom interactive action bar on the card */}
                <div className="mt-4 pt-3 border-t border-[#EFE1DC]/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isCustomized ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B83A4B] bg-white px-2 py-0.5 rounded-full border border-[#F0D5CF] shadow-xs">
                        <span>✨</span> Personalizada por ti
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#A8928D] italic">
                        Texto de nuestro álbum
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isCustomized && onResetMemory && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-[#8C7A75] hover:text-[#B83A4B] bg-white hover:bg-[#FAF0ED] rounded-lg border border-[#E8D0CB] transition-colors cursor-pointer"
                        title="Restablecer al texto original"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restablecer</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setEditTender(memory.tenderMessage);
                        setEditPoetic(memory.poeticNote);
                        setIsEditing(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#B83A4B] to-[#9E2A3B] hover:from-[#A53040] hover:to-[#8B2332] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar texto de esta carta</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Sweet Romantic Quote Footer */}
          <div className="text-center pt-1">
            <p className="text-xs text-[#9C8B86] italic font-serif">
              "Cada latido guarda la memoria de un instante a tu lado."
            </p>
          </div>
        </div>

        {/* Modal Navigation Footer */}
        <div className="px-6 py-4 bg-[#F7F1EC]/80 border-t border-[#EFE1DC] flex items-center justify-between shrink-0">
          <button
            onClick={onPrev}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B5A55] hover:text-[#B83A4B] hover:bg-[#EFE5E0] rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: total }).map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-4 bg-[#B83A4B]"
                    : "bg-[#D8C7C2]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B5A55] hover:text-[#B83A4B] hover:bg-[#EFE5E0] rounded-lg transition-colors cursor-pointer"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
