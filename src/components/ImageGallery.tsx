import React, { useState } from 'react';
import { X, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface Props {
  images: string[];
}

export default function ImageGallery({ images }: Props) {
  const [showLightbox, setShowLightbox] = useState(false);

  const openLightbox = () => {
    setShowLightbox(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {/* Grid - Clean Bento Layout without zooms */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden group">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 w-full h-full">
          <div className="col-span-2 row-span-2 relative overflow-hidden bg-gray-50">
            <img 
              src={images[0]} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-90" 
              alt="Main gallery" 
              onClick={() => openLightbox()}
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden bg-gray-50">
            <img 
              src={images[1]} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-90" 
              alt="Gallery 2" 
              onClick={() => openLightbox()}
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden bg-gray-50">
            <img 
              src={images[2]} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-90" 
              alt="Gallery 3" 
              onClick={() => openLightbox()}
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden bg-gray-50">
            <img 
              src={images[3]} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-90" 
              alt="Gallery 4" 
              onClick={() => openLightbox()}
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden bg-gray-50">
            <img 
              src={images[4]} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-90" 
              alt="Gallery 5" 
              onClick={() => openLightbox()}
            />
          </div>
        </div>

        <button 
          onClick={() => openLightbox()}
          className="absolute bottom-4 md:bottom-6 right-4 md:right-6 bg-white border border-black/10 px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-lg font-semibold text-xs md:text-sm hover:bg-gray-50 transition-all flex items-center gap-2 hover:translate-y-[-2px] active:translate-y-0 z-10"
        >
          <Grid size={16} />
          Alle Fotos anzeigen
        </button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <button 
                onClick={closeLightbox}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Schließen"
              >
                <X size={24} />
              </button>
              <div className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Alle Bilder ({images.length})
              </div>
              <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Scrollable Gallery Content */}
            <div className="flex-1 overflow-y-auto px-4 md:px-10 py-10 no-scrollbar">
              <div className="max-w-7xl mx-auto">
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                  {images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="break-inside-avoid"
                    >
                      <img
                        src={img}
                        className="w-full rounded-2xl shadow-sm border border-black/5 object-cover hover:opacity-90 transition-opacity cursor-auto"
                        referrerPolicy="no-referrer"
                        alt={`Galerie Bild ${idx + 1}`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

