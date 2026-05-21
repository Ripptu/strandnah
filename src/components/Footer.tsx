import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-text-primary border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-text-primary">Strandnah Usedom</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Ihr Partner für exklusive Immobilien und unvergessliche Urlaubsmomente auf der Sonneninsel Usedom.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-6 text-text-primary">Unternehmen</h4>
            <div className="flex flex-col gap-3 text-sm text-text-secondary">
              <Link to="/ferienwohnungen" className="hover:text-black transition-colors">Vermietung</Link>
              <Link to="/eigentumswohnungen" className="hover:text-black transition-colors">Verkauf</Link>
              <Link to="/kontakt" className="hover:text-black transition-colors">Kontakt</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-text-primary">Rechtliches</h4>
            <div className="flex flex-col gap-3 text-sm text-text-secondary">
              <Link to="/impressum" className="hover:text-black transition-colors">Impressum</Link>
              <Link to="/datenschutz" className="hover:text-black transition-colors">Datenschutzerklärung</Link>
              <Link to="/agb" className="hover:text-black transition-colors">AGB</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-text-primary">Kontakt</h4>
            <div className="text-sm text-text-secondary space-y-4">
              <p>alp Verwaltungs GmbH<br />10707 Berlin</p>
              <a 
                href="https://wa.me/4915565224488" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-black transition-all pt-2"
              >
                <MessageCircle size={18} className="text-green-600" />
                <span>+49 15565 224488</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} alp Verwaltungs GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <Link to="/datenschutz" className="hover:text-black transition-colors">Datenschutz</Link>
            <Link to="/impressum" className="hover:text-black transition-colors">Impressum</Link>
            <Link to="/agb" className="hover:text-black transition-colors">AGB</Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-text-secondary/70">
          Made by <a href="https://vamela.info" target="_blank" rel="noopener noreferrer" className="font-semibold text-text-secondary hover:text-black transition-colors underline decoration-dotted underline-offset-2">VAMELA</a>
        </div>
      </div>
    </footer>
  );
}
