import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, Sparkles, Mail, Edit3, Check, RotateCcw } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

export interface SecretLetterData {
  p1: string;
  p2: string;
  p3: string;
  signature: string;
}

export const DEFAULT_SECRET_LETTER: SecretLetterData = {
  p1: "Si estás leyendo esto es porque agitaste tu teléfono o descubriste este rinconcito secreto que guardé solo para ti.",
  p2: "Quiero que nunca olvides lo infinitamente especial que eres en mi vida. Desde que me regalaste tu sonrisa y dijiste que sí, no hay un solo día en el que no agradezca al universo por tenerte a mi lado.",
  p3: "Eres mi calma, mi motivo de alegría y la niña más hermosa de todo el mundo. Gracias por cada instante, por cada mirada y por enseñarme a amar de la forma más linda y sincera.",
  signature: "Mivi te ama con todo su corazón 💗",
};

export const SecretLetterModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const lastShakeTimeRef = useRef(0);
  const lastAccRef = useRef({ x: 0, y: 0, z: 0 });

  // Letter content persisted in localStorage
  const [letterData, setLetterData] = useState<SecretLetterData>(() => {
    try {
      const saved = localStorage.getItem('romantic_custom_secret_letter');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          p1: parsed.p1 ?? DEFAULT_SECRET_LETTER.p1,
          p2: parsed.p2 ?? DEFAULT_SECRET_LETTER.p2,
          p3: parsed.p3 ?? DEFAULT_SECRET_LETTER.p3,
          signature: parsed.signature ?? DEFAULT_SECRET_LETTER.signature,
        };
      }
    } catch (_) {}
    return DEFAULT_SECRET_LETTER;
  });

  // Draft state while editing
  const [draftP1, setDraftP1] = useState(letterData.p1);
  const [draftP2, setDraftP2] = useState(letterData.p2);
  const [draftP3, setDraftP3] = useState(letterData.p3);
  const [draftSignature, setDraftSignature] = useState(letterData.signature);

  const isCustomized =
    letterData.p1 !== DEFAULT_SECRET_LETTER.p1 ||
    letterData.p2 !== DEFAULT_SECRET_LETTER.p2 ||
    letterData.p3 !== DEFAULT_SECRET_LETTER.p3 ||
    letterData.signature !== DEFAULT_SECRET_LETTER.signature;

  // Shake detection listener
  useEffect(() => {
    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const deltaX = Math.abs(acc.x - lastAccRef.current.x);
      const deltaY = Math.abs(acc.y - lastAccRef.current.y);
      const deltaZ = Math.abs(acc.z - lastAccRef.current.z);

      lastAccRef.current = { x: acc.x, y: acc.y, z: acc.z };

      const totalMovement = deltaX + deltaY + deltaZ;
      const now = Date.now();

      // Shake threshold
      if (totalMovement > 26 && now - lastShakeTimeRef.current > 2000) {
        lastShakeTimeRef.current = now;
        openLetter();
      }
    };

    if (typeof window !== 'undefined' && 'ondevicemotion' in window) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      }
    };
  }, []);

  const openLetter = () => {
    setIsOpen(true);
    setIsEditing(false);
    setDraftP1(letterData.p1);
    setDraftP2(letterData.p2);
    setDraftP3(letterData.p3);
    setDraftSignature(letterData.signature);
    romanticAudio.playUnlockSuccess();
    if (navigator.vibrate) {
      try {
        navigator.vibrate([60, 50, 60]);
      } catch (_) {}
    }
  };

  const closeLetter = () => {
    setIsOpen(false);
    setIsEditing(false);
  };

  const startEditMode = () => {
    setDraftP1(letterData.p1);
    setDraftP2(letterData.p2);
    setDraftP3(letterData.p3);
    setDraftSignature(letterData.signature);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SecretLetterData = {
      p1: draftP1.trim() || DEFAULT_SECRET_LETTER.p1,
      p2: draftP2.trim(),
      p3: draftP3.trim(),
      signature: draftSignature.trim() || DEFAULT_SECRET_LETTER.signature,
    };
    setLetterData(updated);
    try {
      localStorage.setItem('romantic_custom_secret_letter', JSON.stringify(updated));
    } catch (_) {}

    setIsEditing(false);
    setSaveToast(true);
    romanticAudio.playTone(1046.5, 0.4, 0.25);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleResetToDefault = () => {
    setLetterData(DEFAULT_SECRET_LETTER);
    setDraftP1(DEFAULT_SECRET_LETTER.p1);
    setDraftP2(DEFAULT_SECRET_LETTER.p2);
    setDraftP3(DEFAULT_SECRET_LETTER.p3);
    setDraftSignature(DEFAULT_SECRET_LETTER.signature);
    try {
      localStorage.removeItem('romantic_custom_secret_letter');
    } catch (_) {}
    setIsEditing(false);
    romanticAudio.playTone(440, 0.3, 0.2);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <>
      {/* 
        Subtle Shake-to-Reveal trigger button
        Discreetly placed in footer area for desktop or manual trigger
      */}
      <button
        onClick={openLetter}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF0ED] hover:bg-[#FCE8EA] border border-[#F0D5CF] text-[#9E2A3B] text-[11px] font-medium shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
        title="Agita tu teléfono o toca aquí para descubrir la carta secreta"
      >
        <Mail className="w-3.5 h-3.5" />
        <span className="font-serif">Carta secreta</span>
        <span className="text-[10px] text-[#A8928D] hidden xs:inline">(agita el móvil)</span>
      </button>

      {/* 
        MODAL DE CARTA SECRETA
        Montado con createPortal directamente en document.body para centrado total
      */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-[#2B1B17]/65 backdrop-blur-md animate-fadeIn"
            onClick={closeLetter}
          >
            {/* Vintage Cotton Linen Letter Paper Card */}
            <div
              className="relative w-full max-w-lg bg-[#FAF7F0] border-2 border-[#E5DACD] rounded-[2rem] p-6 sm:p-9 shadow-[0_25px_60px_rgba(40,20,15,0.4)] overflow-y-auto max-h-[92vh] text-center transform scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Wax Seal Insignia */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#B83A4B] to-[#8C202F] border-2 border-[#D4AF37] shadow-lg flex items-center justify-center text-white font-script text-2xl font-bold select-none">
                M
              </div>

              {/* Action bar: Edit button & Close button */}
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <button
                  onClick={() => (isEditing ? setIsEditing(false) : startEditMode())}
                  className={`p-2 rounded-full transition-colors flex items-center gap-1 ${
                    isEditing
                      ? 'bg-[#FAF0ED] text-[#B83A4B] font-semibold text-xs'
                      : 'text-[#8C7A75] hover:bg-[#F2ECE6] hover:text-[#B83A4B]'
                  }`}
                  title={isEditing ? 'Cancelar edición' : 'Editar mensaje de esta carta'}
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-[11px] hidden xs:inline">
                    {isEditing ? 'Viendo' : 'Editar'}
                  </span>
                </button>

                <button
                  onClick={closeLetter}
                  className="p-2 rounded-full text-[#8C7A75] hover:bg-[#F2ECE6] hover:text-[#4A3E3D] transition-colors cursor-pointer"
                  title="Cerrar carta secreta"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Save toast */}
              {saveToast && (
                <div className="mt-2 mb-3 py-1.5 px-3 bg-[#EAF5EC] border border-[#C5E5CB] text-[#2D6A4F] text-xs rounded-xl flex items-center justify-center gap-1.5 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Carta secreta guardada para siempre! 💌</span>
                </div>
              )}

              <div className="pt-4">
                <span className="text-[10px] uppercase tracking-widest text-[#B83A4B] font-bold block mb-1">
                  Carta Secreta de Amor
                </span>
                <h3 className="font-script text-3xl sm:text-4xl text-[#341818] mb-3">
                  Para mi niña consentida
                </h3>

                <div className="w-16 h-0.5 bg-[#D4AF37]/60 mx-auto mb-5 rounded-full" />

                {isEditing ? (
                  /* ======================================================== */
                  /* MODO EDICIÓN DE LA CARTA SECRETA                         */
                  /* ======================================================== */
                  <form onSubmit={handleSave} className="text-left space-y-3.5 animate-fadeIn">
                    <div className="bg-[#F6EFE8] rounded-xl p-3 border border-[#E8DCD2] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#8B3A45] flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5" />
                        Edita tus palabras para la carta secreta
                      </span>
                      {isCustomized && (
                        <button
                          type="button"
                          onClick={handleResetToDefault}
                          className="text-[11px] text-[#8C7A75] hover:text-[#B83A4B] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Restablecer al texto original"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Original</span>
                        </button>
                      )}
                    </div>

                    {/* Paragraph 1 */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5B55] block mb-1">
                        Párrafo 1 (Inicio secreto):
                      </label>
                      <textarea
                        value={draftP1}
                        onChange={(e) => setDraftP1(e.target.value)}
                        rows={2}
                        className="w-full p-2.5 text-sm sm:text-base font-cormorant italic text-[#3E2F2C] bg-white border border-[#E2D5C8] focus:border-[#B83A4B] focus:ring-2 focus:ring-[#B83A4B]/15 rounded-xl outline-none leading-relaxed resize-none shadow-inner"
                        placeholder="Escribe el primer párrafo..."
                        required
                      />
                    </div>

                    {/* Paragraph 2 */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5B55] block mb-1">
                        Párrafo 2 (Dedicatoria y sentimientos):
                      </label>
                      <textarea
                        value={draftP2}
                        onChange={(e) => setDraftP2(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 text-sm sm:text-base font-cormorant italic text-[#3E2F2C] bg-white border border-[#E2D5C8] focus:border-[#B83A4B] focus:ring-2 focus:ring-[#B83A4B]/15 rounded-xl outline-none leading-relaxed resize-none shadow-inner"
                        placeholder="Escribe el segundo párrafo..."
                      />
                    </div>

                    {/* Paragraph 3 */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5B55] block mb-1">
                        Párrafo 3 (Palabras de amor y gratitud):
                      </label>
                      <textarea
                        value={draftP3}
                        onChange={(e) => setDraftP3(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 text-sm sm:text-base font-cormorant italic text-[#3E2F2C] bg-white border border-[#E2D5C8] focus:border-[#B83A4B] focus:ring-2 focus:ring-[#B83A4B]/15 rounded-xl outline-none leading-relaxed resize-none shadow-inner"
                        placeholder="Escribe el tercer párrafo..."
                      />
                    </div>

                    {/* Signature */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5B55] block mb-1">
                        Firma / Despedida final:
                      </label>
                      <input
                        type="text"
                        value={draftSignature}
                        onChange={(e) => setDraftSignature(e.target.value)}
                        className="w-full p-2.5 text-sm sm:text-base font-script text-[#B83A4B] bg-white border border-[#E2D5C8] focus:border-[#B83A4B] focus:ring-2 focus:ring-[#B83A4B]/15 rounded-xl outline-none shadow-inner"
                        placeholder="Mivi te ama con todo su corazón 💗"
                        required
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAE0D6]">
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
                        <span>Guardar carta secreta ♥</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* ======================================================== */
                  /* MODO LECTURA DE LA CARTA SECRETA                         */
                  /* ======================================================== */
                  <>
                    <div className="text-left space-y-4 font-cormorant text-lg sm:text-xl text-[#4A3835] leading-relaxed italic px-1 sm:px-3">
                      {letterData.p1 && <p>{letterData.p1}</p>}
                      {letterData.p2 && <p>{letterData.p2}</p>}
                      {letterData.p3 && <p>{letterData.p3}</p>}
                      {letterData.signature && (
                        <p className="text-right pt-2 font-script text-2xl sm:text-3xl text-[#B83A4B] font-normal not-italic">
                          {letterData.signature}
                        </p>
                      )}
                    </div>

                    {/* Bottom action bar */}
                    <div className="mt-6 pt-4 border-t border-[#EAE0D6] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isCustomized ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B83A4B] bg-white px-2 py-0.5 rounded-full border border-[#F0D5CF] shadow-xs">
                            <span>✨</span> Mensaje personalizado
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#A8928D] italic">
                            Mensaje secreto original
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isCustomized && (
                          <button
                            type="button"
                            onClick={handleResetToDefault}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-[#8C7A75] hover:text-[#B83A4B] bg-white hover:bg-[#FAF0ED] rounded-lg border border-[#E8D0CB] transition-colors cursor-pointer"
                            title="Restablecer al texto original"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Restablecer</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={startEditMode}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#B83A4B] to-[#9E2A3B] hover:from-[#A53040] hover:to-[#8B2332] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modificar mensaje de la carta</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-6 pt-3 border-t border-[#EAE0D6]/60 flex items-center justify-center gap-2 text-xs text-[#8C7A75]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Siempre juntos · Para toda la vida</span>
                  <Heart className="w-3.5 h-3.5 fill-[#B83A4B] text-[#B83A4B]" />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
