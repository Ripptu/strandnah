import { Share, Heart } from 'lucide-react';

interface Props {
  images: string[];
}

export default function ImageGallery({ images }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[350px] md:h-[480px] w-full rounded-2xl overflow-hidden relative">
        <div className="col-span-2 row-span-2">
          <img src={images[0]} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-opacity hover:opacity-90 cursor-pointer" alt="Main gallery" />
        </div>
        <div className="col-span-1 row-span-1">
          <img src={images[1]} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-opacity hover:opacity-90 cursor-pointer" alt="Gallery 2" />
        </div>
        <div className="col-span-1 row-span-1">
          <img src={images[2]} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-opacity hover:opacity-90 cursor-pointer" alt="Gallery 3" />
        </div>
        <div className="col-span-1 row-span-1">
          <img src={images[3]} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-opacity hover:opacity-90 cursor-pointer" alt="Gallery 4" />
        </div>
        <div className="col-span-1 row-span-1">
          <img src={images[4]} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-opacity hover:opacity-90 cursor-pointer" alt="Gallery 5" />
        </div>

        <button className="absolute bottom-6 right-6 bg-white border border-black px-4 py-2 rounded-lg shadow-sm font-semibold text-sm hover:bg-gray-50 transition-colors">
          Alle Fotos anzeigen
        </button>
      </div>
    </div>
  );
}
