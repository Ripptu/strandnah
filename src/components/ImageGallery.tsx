import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { X, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { AREA_LABELS, optimizeCloudinaryUrl } from '@/src/constants';

interface Props {
  listing: any;
}

export interface ImageGalleryRef {
  openGallery: (tabId?: string) => void;
}

const ImageGallery = forwardRef<ImageGalleryRef, Props>(({ listing }, ref) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    openGallery: (tabId = 'all') => {
      setShowLightbox(true);
      setActiveTab(tabId);
      document.body.style.overflow = 'hidden';
    }
  }));

  const mainImages = listing.images || [];
  const areaImages = listing.areaImages || {};

  // For the grid view, we want up to 5 images. We can mix mainImages and some areaImages if mainImages < 5
  let gridImages = [...mainImages];
  if (gridImages.length < 5) {
    const allRoomImageArrays = Object.values(areaImages).map((val: any) => Array.isArray(val) ? val : [val]).filter(arr => arr.length > 0);
    let round = 0;
    while (gridImages.length < 5 && allRoomImageArrays.length > 0) {
      let addedInRound = false;
      for (const roomImgs of allRoomImageArrays) {
        if (roomImgs[round] && !gridImages.includes(roomImgs[round])) {
          gridImages.push(roomImgs[round]);
          addedInRound = true;
          if (gridImages.length >= 5) break;
        }
      }
      if (!addedInRound) break; // no more images in any room
      round++;
    }
  }
  // Ensure we have 5 valid strings, otherwise duplicate or use placeholder
  gridImages = gridImages.slice(0, 5).filter(Boolean);
  while (gridImages.length < 5 && gridImages.length > 0) {
    gridImages.push(gridImages[0]);
  }
  if (gridImages.length === 0) {
    gridImages = Array(5).fill('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80');
  }

  // Build lightbox tabs content
  const tabs = [{ id: 'all', label: `Alle Fotos` }];
  const allLightboxImages: string[] = [...mainImages];
  
  Object.entries(AREA_LABELS).forEach(([key, label]) => {
    const val = areaImages[key];
    if (val) {
      const arr = Array.isArray(val) ? val : [val];
      if (arr.some(Boolean)) {
         tabs.push({ id: key, label });
         arr.forEach((v: string) => v && !allLightboxImages.includes(v) && allLightboxImages.push(v));
      }
    }
  });

  let displayImages = allLightboxImages;
  if (activeTab !== 'all') {
    const val = areaImages[activeTab];
    displayImages = Array.isArray(val) ? val : [val];
    displayImages = displayImages.filter(Boolean);
  }

  const openLightbox = () => {
    setShowLightbox(true);
    setActiveTab('all');
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
              src={optimizeCloudinaryUrl(gridImages[0], 1200)} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-90" 
              alt="Main gallery" 
              onClick={() => openLightbox()}
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden bg-gray-50">
            <img 
              src={optimizeCloudinaryUrl(gridImages[1], 800)} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-90" 
              alt="Gallery 2" 
              onClick={() => openLightbox()}
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden bg-gray-50">
            <img 
              src={optimizeCloudinaryUrl(gridImages[2], 800)} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-90" 
              alt="Gallery 3" 
              onClick={() => openLightbox()}
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden bg-gray-50">
            <img 
              src={optimizeCloudinaryUrl(gridImages[3], 800)} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-90" 
              alt="Gallery 4" 
              onClick={() => openLightbox()}
            />
          </div>
          <div className="col-span-1 row-span-1 relative overflow-hidden bg-gray-50">
            <img 
              src={optimizeCloudinaryUrl(gridImages[4], 800)} 
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
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
              <button 
                onClick={closeLightbox}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Schließen"
              >
                <X size={24} />
              </button>
              
              {/* Desktop Tabs */}
              <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap",
                      activeTab === tab.id 
                        ? "bg-black text-white" 
                        : "bg-gray-100 text-text-primary hover:bg-gray-200"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="w-10 md:hidden" /> {/* Spacer for mobile */}
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-3 border-b border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap",
                    activeTab === tab.id 
                      ? "bg-black text-white" 
                      : "bg-gray-100 text-text-primary hover:bg-gray-200"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Gallery Content */}
            <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-10 no-scrollbar">
              <div className="max-w-7xl mx-auto">
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                  {displayImages.map((img, idx) => (
                    <motion.div
                      key={img + idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (idx % 10) * 0.05 }}
                      className="break-inside-avoid"
                    >
                      <img
                        src={optimizeCloudinaryUrl(img, 1200)}
                        loading="lazy"
                        className="w-full rounded-2xl shadow-sm border border-black/5 object-cover hover:opacity-90 transition-opacity cursor-pointer"
                        referrerPolicy="no-referrer"
                        alt={`Galerie Bild ${idx + 1}`}
                        onClick={() => setFullscreenImage(img)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Single Fullscreen Image Overlay */}
            {fullscreenImage && (
              <div 
                className="fixed inset-0 z-[200] bg-black bg-opacity-95 flex items-center justify-center p-4 backdrop-blur-sm" 
                onClick={() => setFullscreenImage(null)}
              >
                <button 
                  className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 z-[210] transition-colors"
                  onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }}
                >
                  <X size={36} />
                </button>
                <img 
                  src={fullscreenImage} 
                  alt="Fullscreen view" 
                  className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ImageGallery;

