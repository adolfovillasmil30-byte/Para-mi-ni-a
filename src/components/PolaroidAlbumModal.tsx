import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Camera,
  Plus,
  Trash2,
  X,
  Heart,
  ZoomIn,
  Sparkles,
  Upload,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';
import { romanticAudio } from '../utils/audio';

export interface PolaroidPhoto {
  id: string;
  dataUrl: string;
  caption: string;
  date: string;
  rotation: number;
}

const STORAGE_KEY = 'romantic_polaroid_album_photos_user';

export const PolaroidAlbumModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);
  const [coverFlipped, setCoverFlipped] = useState(false);

  // Starts completely empty: NO mock photos, NO placeholders
  const [photos, setPhotos] = useState<PolaroidPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidPhoto | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load photos from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out any old starter mockups to ensure completely clean user state
          const userOnly = parsed.filter(
            (p: PolaroidPhoto) => p && !p.id.startsWith('starter-')
          );
          setPhotos(userOnly);
          return;
        }
      }
      setPhotos([]);
    } catch (_) {
      setPhotos([]);
    }
  }, []);

  const savePhotos = (updated: PolaroidPhoto[]) => {
    setPhotos(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage limit reached or disabled', e);
    }
  };

  const handleOpenBook = () => {
    setIsOpeningAnim(true);
    setCoverFlipped(false);
    romanticAudio.playChime();

    // Trigger the 3D book cover open rotation
    setTimeout(() => {
      setCoverFlipped(true);
    }, 150);

    // Reveal open spread after cover flips open
    setTimeout(() => {
      setIsOpen(true);
      setIsOpeningAnim(false);
    }, 850);
  };

  const handleCloseBook = () => {
    setIsOpen(false);
    setCoverFlipped(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newPhotosList: PolaroidPhoto[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        const compressedBase64 = await compressImageFile(file);
        const randomRot = (Math.random() - 0.5) * 4; // subtle tilt: -2 to 2 degrees
        newPhotosList.push({
          id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          dataUrl: compressedBase64,
          caption: 'Un recuerdo especial ♥',
          date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          rotation: parseFloat(randomRot.toFixed(1)),
        });
      } catch (err) {
        console.error('Error procesando imagen', err);
      }
    }

    if (newPhotosList.length > 0) {
      savePhotos([...photos, ...newPhotosList]);
      romanticAudio.playTone(880, 0.4, 0.3);
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = photos.filter((p) => p.id !== id);
    savePhotos(filtered);
    romanticAudio.playTone(392, 0.3, 0.15);
  };

  // Reorder photos: move left or right
  const handleMovePhoto = (index: number, direction: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const newPhotos = [...photos];
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;

    savePhotos(newPhotos);
    romanticAudio.playTone(659.25, 0.2, 0.15);
  };

  const handleUpdateCaption = (id: string, newCaption: string) => {
    const updated = photos.map((p) =>
      p.id === id ? { ...p, caption: newCaption } : p
    );
    savePhotos(updated);
  };

  return (
    <>
      {/* 
        BOTÓN ELEGANTE CON ICONO DE FOTOGRAFÍA ESTILO POLAROID
      */}
      <button
        onClick={handleOpenBook}
        className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#FAF0ED] hover:bg-[#F3E5F8] border border-[#E0CCE8] text-[#6B4380] text-xs sm:text-sm font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer group"
        aria-label="Abrir libro de fotos Polaroid"
      >
        <div className="w-6 h-6 rounded-md bg-white border border-[#D5C2E6] flex items-center justify-center shadow-xs group-hover:rotate-6 transition-transform">
          <Camera className="w-3.5 h-3.5 text-[#855A9E]" />
        </div>
        <span className="font-serif-title tracking-wide">Álbum Polaroid</span>
        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
      </button>

      {/* 
        ANIMACIÓN 3D REALISTA: LIBRO MORADO PASTEL ABRIÉNDOSE
        Montado vía Portal para garantizar centrado absoluto en viewport
      */}
      {isOpeningAnim &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2B1B17]/50 backdrop-blur-md">
            {/* 3D Perspective Stage */}
            <div
              style={{ perspective: '1600px' }}
              className="w-72 sm:w-80 h-[430px] sm:h-[470px] relative select-none"
            >
              {/* Book Body / Pages underneath */}
              <div className="absolute inset-0 bg-[#F5EFE6] rounded-r-2xl border-r-8 border-y-4 border-[#EADFCB] shadow-2xl flex flex-col justify-center items-center text-center p-6">
                <span className="font-script text-3xl text-[#6B4380]">Abriendo páginas...</span>
                <div className="w-12 h-1 bg-[#D4AF37] rounded-full my-3" />
                <p className="text-xs text-[#8C7A75]">Nuestra historia en fotos</p>
              </div>

              {/* Front Hardcover in Pastel Purple - Hinged at Left Spine */}
              <div
                style={{
                  transformOrigin: 'left center',
                  transform: coverFlipped ? 'rotateY(-145deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.75s cubic-bezier(0.25, 1, 0.5, 1)',
                  transformStyle: 'preserve-3d',
                }}
                className="absolute inset-0 bg-gradient-to-br from-[#BAA1D4] via-[#C9B3E2] to-[#B299CD] rounded-r-2xl border-l-[18px] border-[#8C6FA8] border-r-4 border-y-4 border-[#E8DEF3] shadow-[0_20px_50px_rgba(70,40,90,0.4)] p-6 flex flex-col justify-between items-center text-center z-20"
              >
                {/* Golden Corner Guards */}
                <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]" />
                <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]" />

                {/* Book Spine Texture ridges */}
                <div className="absolute left-[-18px] top-6 w-3.5 h-1.5 bg-[#6D5385] rounded-r-sm" />
                <div className="absolute left-[-18px] top-20 w-3.5 h-1.5 bg-[#6D5385] rounded-r-sm" />
                <div className="absolute left-[-18px] bottom-20 w-3.5 h-1.5 bg-[#6D5385] rounded-r-sm" />
                <div className="absolute left-[-18px] bottom-6 w-3.5 h-1.5 bg-[#6D5385] rounded-r-sm" />

                {/* Gold Embossed Cameo in Center */}
                <div className="my-auto">
                  <div className="w-20 h-20 rounded-full bg-[#FAF0FC]/70 border-2 border-[#D4AF37] shadow-inner flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-[#6B4380]" />
                  </div>
                  <h4 className="font-serif-title text-xl text-[#341846] font-bold tracking-wider">
                    NUESTRO ÁLBUM
                  </h4>
                  <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto my-2" />
                  <p className="font-script text-2xl text-[#512D66]">
                    Memorias de nuestro amor
                  </p>
                </div>

                {/* Hanging Bookmark Ribbon */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-4 h-9 bg-[#B83A4B] rounded-b-sm shadow-md" />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 
        MODAL COMPLETO: LIBRO FÍSICO ABIERTO EN MORADO PASTEL
        Montado vía Portal directamente en document.body para garantizar centrado perfecto en viewport
      */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5 bg-[#2B1B17]/60 backdrop-blur-md animate-fadeIn"
            onClick={handleCloseBook}
          >
            {/* Physical Book Exterior Hardcover in Pastel Purple */}
            <div
              className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] bg-gradient-to-r from-[#B59ECC] via-[#C9B3E2] to-[#B59ECC] rounded-[2rem] sm:rounded-[2.75rem] p-3 sm:p-5 shadow-[0_30px_70px_rgba(50,25,75,0.45)] border-4 border-[#EAE1F5] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Book Spine Center Gutter Fold Shadow (Divides Left & Right Pages) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/20 via-black/8 to-black/20 pointer-events-none hidden md:block z-30 shadow-2xl" />

              {/* Silk Bookmark Ribbon Hanging from Top Center */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-14 bg-gradient-to-b from-[#B83A4B] to-[#962534] shadow-md z-40 rounded-b-sm hidden md:block">
                <div className="w-full h-1 bg-[#D4AF37]" />
              </div>

              {/* Header Toolbar within Book Cover */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#FAF5FD]/95 rounded-2xl border border-[#DFD1ED] mb-3 backdrop-blur-sm shrink-0 z-30 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#8C62A8]" />
                  <span className="font-serif-title text-xs sm:text-sm font-bold text-[#442357] tracking-wider uppercase">
                    Libro de Recuerdos Polaroid
                  </span>
                  <span className="text-[11px] text-[#7A5B8C] hidden sm:inline">
                    · {photos.length} {photos.length === 1 ? 'fotografía' : 'fotografías'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8C62A8] to-[#764A92] hover:from-[#764A92] hover:to-[#633B7E] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Subiendo...' : 'Pegar foto'}</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    onClick={handleCloseBook}
                    className="p-1.5 rounded-xl text-[#7A5B8C] hover:bg-[#EAE0F5] hover:text-[#442357] transition-colors cursor-pointer"
                    title="Cerrar libro"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Open Book Spread Interior (Heavy Textured Linen Pages) */}
              <div className="flex-grow overflow-y-auto bg-[#FAF7F2] rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#E5DACD] shadow-inner relative z-10">
                {/* Subtle Book Page Border and Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8C62A8] block">
                    Álbum Privado · Nuestra Historia
                  </span>
                  <h3 className="font-script text-3xl sm:text-5xl text-[#391C47] mt-1">
                    Nuestras Fotos Favoritas
                  </h3>
                  <div className="w-20 h-0.5 bg-[#D4AF37]/60 mx-auto mt-2 rounded-full" />
                </div>

                {/* 
                  EMPTY STATE (Clean and pristine when 0 photos)
                */}
                {photos.length === 0 ? (
                  <div className="max-w-md mx-auto text-center py-10 px-4">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-white/80 hover:bg-white border-2 border-dashed border-[#C9B6DE] hover:border-[#8C62A8] rounded-3xl p-8 sm:p-12 cursor-pointer transition-all hover:shadow-lg group flex flex-col items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-[#F7EFFC] border border-[#E4D1F0] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                        <ImageIcon className="w-8 h-8 text-[#8C62A8]" />
                      </div>
                      <h4 className="font-serif-title text-lg sm:text-xl font-bold text-[#442357]">
                        Tu libro de recuerdos está listo
                      </h4>
                      <p className="text-xs sm:text-sm text-[#7A6964] mt-2 mb-5 max-w-xs leading-relaxed font-body">
                        Aún no hay fotos guardadas. Toca aquí para subir tus fotos favoritas juntos desde tu teléfono o dispositivo.
                      </p>
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8C62A8] to-[#764A92] text-white text-xs sm:text-sm font-semibold shadow-md group-hover:shadow-lg transition-all">
                        <Plus className="w-4 h-4" />
                        <span>Subir primeras fotos</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Photo Scrapbook Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-9 justify-items-center">
                    {/* Add More Photos Card */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-56 sm:w-64 h-72 sm:h-80 bg-white/70 hover:bg-white border-2 border-dashed border-[#C9B6DE] hover:border-[#8C62A8] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-102 hover:shadow-md group"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#FAF0FC] border border-[#E4D1F0] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                        <Upload className="w-6 h-6 text-[#8C62A8]" />
                      </div>
                      <h5 className="font-serif-title text-sm font-bold text-[#442357]">
                        Pegar más fotos
                      </h5>
                      <p className="text-[11px] text-[#7A6964] mt-1 max-w-[170px] leading-relaxed">
                        Sube más momentos especiales desde tu galería
                      </p>
                      <span className="mt-3 inline-block px-3 py-1 bg-[#F4EBF7] text-[#8C62A8] text-[10px] rounded-lg font-semibold">
                        + Añadir Polaroid
                      </span>
                    </div>

                    {/* Render Polaroid Photos */}
                    {photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        style={{
                          transform: `rotate(${photo.rotation}deg)`,
                        }}
                        className="w-56 sm:w-64 bg-white p-3 pt-3.5 pb-4 rounded-xs shadow-[0_12px_28px_rgba(0,0,0,0.13)] border border-[#EAE0D6] hover:scale-105 hover:z-20 transition-all duration-300 relative group cursor-pointer select-none"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        {/* Washi Tape at Top Corner */}
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#EADCF5]/85 border border-[#DAC6E8] rounded-xs shadow-xs transform -rotate-1 pointer-events-none" />

                        {/* Polaroid Photo Image */}
                        <div className="w-full h-52 sm:h-60 bg-[#FAF6F0] rounded-xs overflow-hidden border border-[#E8DCD6] relative shadow-inner">
                          <img
                            src={photo.dataUrl}
                            alt="Foto Polaroid"
                            className="w-full h-full object-cover"
                          />

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPhoto(photo);
                              }}
                              className="p-2 rounded-full bg-white text-[#442357] hover:scale-110 transition-transform shadow-md"
                              title="Ver en grande"
                            >
                              <ZoomIn className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeletePhoto(photo.id, e)}
                              className="p-2 rounded-full bg-white text-[#B83A4B] hover:scale-110 transition-transform shadow-md"
                              title="Eliminar foto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Classic Thick Bottom Margin with handwritten caption */}
                        <div className="pt-3 px-1 text-center">
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="font-script text-xl sm:text-2xl text-[#391C47] w-full text-center bg-transparent outline-none focus:border-b focus:border-[#8C62A8]"
                            placeholder="Escribe un recuerdo..."
                          />

                          {/* Reordering and Date Bar */}
                          <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-[#F2ECE6] text-[10px] text-[#A8928D]">
                            {/* Move Left */}
                            <button
                              onClick={(e) => handleMovePhoto(index, 'left', e)}
                              disabled={index === 0}
                              className={`p-1 rounded hover:bg-[#F2ECE6] transition-colors ${
                                index === 0 ? 'opacity-20 cursor-default' : 'hover:text-[#442357]'
                              }`}
                              title="Mover foto a la izquierda"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            <span className="uppercase tracking-wider">
                              {photo.date}
                            </span>

                            {/* Move Right */}
                            <button
                              onClick={(e) => handleMovePhoto(index, 'right', e)}
                              disabled={index === photos.length - 1}
                              className={`p-1 rounded hover:bg-[#F2ECE6] transition-colors ${
                                index === photos.length - 1 ? 'opacity-20 cursor-default' : 'hover:text-[#442357]'
                              }`}
                              title="Mover foto a la derecha"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Book Quote */}
                <div className="mt-12 pt-6 border-t border-[#EFE1DC] text-center text-xs text-[#8C7A75]">
                  <p className="font-serif italic text-sm">
                    "Todas las fotos quedan guardadas para siempre en este libro ♥"
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 
        PHOTO ZOOM POPUP
      */}
      {selectedPhoto &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-lg w-full bg-white p-4 pb-6 rounded-lg shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#B83A4B] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <img
                src={selectedPhoto.dataUrl}
                alt="Foto polaroid ampliada"
                className="w-full max-h-[70vh] object-contain rounded-sm"
              />
              <p className="font-script text-3xl text-[#391C47] mt-4">
                {selectedPhoto.caption}
              </p>
              <span className="text-xs text-[#8C7A75] block mt-1">
                {selectedPhoto.date}
              </span>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
