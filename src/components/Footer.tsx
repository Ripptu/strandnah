import { Link } from 'react-router-dom';
import { Globe, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F7F7F7] border-t border-border-light pt-8 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-text-primary">
            <span>© 2026 Strandnah Usedom GmbH</span>
            <span className="hidden md:inline">·</span>
            <Link to="/datenschutz" className="hover:underline">Datenschutz</Link>
            <span className="hidden md:inline">·</span>
            <Link to="/impressum" className="hover:underline">Impressum</Link>
            <span className="hidden md:inline">·</span>
            <Link to="/agb" className="hover:underline">AGB</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Facebook size={18} className="cursor-pointer" />
            <Twitter size={18} className="cursor-pointer" />
            <Instagram size={18} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
