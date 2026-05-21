import { Star } from 'lucide-react';
import { Listing, optimizeCloudinaryUrl } from '@/src/constants';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface Props {
  listing: any; 
  onClick?: () => void;
  key?: any;
}

export default function ListingCard({ listing, onClick }: Props) {
  const isInactive = listing.isActive === false;

  return (
    <motion.div 
      whileHover={isInactive ? undefined : { y: -4 }}
      className={cn("group flex flex-col gap-3 relative", isInactive ? "cursor-default" : "cursor-pointer")}
      onClick={isInactive ? undefined : onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        <img
          src={optimizeCloudinaryUrl(listing.images[0], 800)}
          alt={listing.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={cn("h-full w-full object-cover transition-transform duration-500", isInactive ? "grayscale opacity-70" : "group-hover:scale-110")}
        />
        {isInactive && (
          <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-6 py-2 rounded-full font-bold tracking-widest uppercase text-sm">
              Demnächst
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={cn("flex flex-col gap-1", isInactive ? "opacity-60 grayscale" : "")}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[15px] truncate text-text-primary">{listing.title}</h3>
        </div>
        <p className="text-sm text-text-secondary">{listing.location}</p>
        <p className="text-sm text-text-secondary truncate">{listing.features.join(' · ')}</p>
        <div className="mt-1">
          <span className="font-bold text-[15px]">{listing.price}</span>
          {listing.type === 'rental' && <span className="text-sm font-normal"> pro Nacht</span>}
        </div>
      </div>
    </motion.div>
  );
}
