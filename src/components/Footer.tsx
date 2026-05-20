import { Link } from 'react-router-dom';
import { Globe, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1e293b] text-white pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-serif italic text-[#c5a044] mb-6">Strandnah Usedom</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Ihr Partner für exklusive Immobilien und unvergessliche Urlaubsmomente auf der Sonneninsel Usedom.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#c5a044] mb-6">Unternehmen</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <Link to="/ferienwohnungen" className="hover:text-white transition-colors">Vermietung</Link>
              <Link to="/eigentumswohnungen" className="hover:text-white transition-colors">Verkauf</Link>
              <Link to="/kontakt" className="hover:text-white transition-colors">Kontakt</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#c5a044] mb-6">Rechtliches</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link>
              <Link to="/datenschutz" className="hover:text-white transition-colors">Datenschutzerklärung</Link>
              <Link to="/agb" className="hover:text-white transition-colors">AGB</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#c5a044] mb-6">Kontakt</h4>
            <div className="text-sm text-gray-400 space-y-4">
              <p>alp Verwaltungs GmbH<br />10707 Berlin</p>
              <a 
                href="https://wa.me/4915565224488" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-white transition-all pt-2"
              >
                <MessageCircle size={18} className="text-green-500" />
                <span>+49 15565 224488</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} alp Verwaltungs GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex gap-8">
            <Link to="/datenschutz" className="hover:text-white transition-colors">Datenschutzerklärung</Link>
            <Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link to="/agb" className="hover:text-white transition-colors">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
