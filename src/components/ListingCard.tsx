import { Star } from 'lucide-react';
import { Listing } from '@/src/constants';
import { motion } from 'motion/react';

interface Props {
  listing: any; 
  onClick?: () => void;
  key?: any;
}

export default function ListingCard({ listing, onClick }: Props) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group cursor-pointer flex flex-col gap-3"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        <img
          src={listing.images[0]}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
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
