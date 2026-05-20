import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        navigate('/admin');
        return 0; // Reset counter after navigation
      } else if (newCount === 1) {
        navigate('/'); // Only navigate to home on the first click so we don't spam router
      }
      return newCount;
    });
  };

  useEffect(() => {
    if (logoClicks > 0 && logoClicks < 5) {
      const timer = setTimeout(() => setLogoClicks(0), 1500);
      return () => clearTimeout(timer);
    }
  }, [logoClicks]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Startseite', href: '/' },
    { name: 'Ferienwohnungen', href: '/ferienwohnungen' },
    { name: 'Eigentumswohnungen', href: '/eigentumswohnungen' },
    { name: 'Lage & Umgebung', href: '/lage' },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center',
        isScrolled || !isHome
          ? 'bg-white border-b border-border-light shadow-sm'
          : 'bg-transparent text-white'
      )}
    >
      <div className="max-w-[1280px] mx-auto w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={handleLogoClick}
          className="cursor-pointer flex items-center gap-3"
        >
          <img 
            src="https://s1.directupload.eu/images/260506/r4mvooig.webp" 
            alt="Strandnah Usedom Logo" 
            className={cn(
              "h-16 w-auto object-contain transition-all active:scale-95",
              isScrolled || !isHome ? "" : "brightness-0 invert"
            )}
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-semibold transition-colors hover:opacity-70",
                isScrolled || !isHome ? "text-text-primary" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/4915565224488"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-black/5"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b border-border-light py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300 md:hidden shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-text-primary"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://wa.me/4915565224488"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-xl text-lg font-semibold"
          >
            <MessageCircle size={20} />
            WhatsApp Kontakt
          </a>
        </div>
      )}
    </nav>
  );
}
