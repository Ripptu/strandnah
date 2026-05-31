import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  statistics: boolean;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    statistics: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('fewo-cookie-consent');
    if (!savedConsent) {
      // Delay showing the banner slightly for a more premium experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, statistics: true };
    localStorage.setItem('fewo-cookie-consent', JSON.stringify(allAccepted));
    setIsVisible(false);
    // Execute event in case other components need to know
    window.dispatchEvent(new Event('cookie-consent-updated'));
  };

  const handleAcceptEssential = () => {
    const onlyEssential = { essential: true, statistics: false };
    localStorage.setItem('fewo-cookie-consent', JSON.stringify(onlyEssential));
    setIsVisible(false);
    window.dispatchEvent(new Event('cookie-consent-updated'));
  };

  const handleSaveSelection = () => {
    localStorage.setItem('fewo-cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
    window.dispatchEvent(new Event('cookie-consent-updated'));
  };

  const toggleStatistic = () => {
    setPreferences(prev => ({ ...prev, statistics: !prev.statistics }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 150 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md bg-white border border-gray-100 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
          id="cookie-consent-banner"
        >
          {/* Main Container */}
          <div className="p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
                  <Cookie className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">Privatsphäre & Cookies</h3>
                  <p className="text-[10px] text-gray-400 font-medium">fewo-inseltraum-usedom.de</p>
                </div>
              </div>
              <button 
                onClick={handleAcceptEssential} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Nur essentielle akzeptieren"
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <div className="text-xs text-gray-600 leading-relaxed font-normal">
              Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. Einige sind für den Betrieb der Seite technisch notwendig, während andere uns helfen, das Nutzererlebnis und die Belegungsstatistiken anonymisiert zu analysieren.
            </div>

            {/* Link to Policy */}
            <div className="flex gap-2 text-[11px] text-gray-400">
              <Link to="/datenschutz" className="hover:text-black hover:underline transition-colors">Datenschutzerklärung</Link>
              <span>•</span>
              <Link to="/impressum" className="hover:text-black hover:underline transition-colors">Impressum</Link>
            </div>

            {/* Detail Settings Accordion */}
            <div className="border-t border-gray-100 pt-2">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors font-semibold"
              >
                {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Einstellungen anpassen
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-3 flex flex-col gap-3"
                  >
                    {/* Essential (Required) */}
                    <div className="flex justify-between items-start p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex-grow pr-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-800">Essenziell</span>
                          <span className="bg-gray-200 text-[10px] text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90">Erforderlich</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                          Unverzichtbare Cookies für die Seitennavigation, Buchungsanfragen und Sicherheitsfeatures.
                        </p>
                      </div>
                      <div className="h-5 w-5 rounded-md bg-gray-200 flex items-center justify-center text-gray-600">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="flex justify-between items-start p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={toggleStatistic}>
                      <div className="flex-grow pr-4">
                        <span className="font-bold text-xs text-gray-800">Statistiken & Analyse</span>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                          Ermöglicht uns, die Seitenbesuche und das Buchungsverhalten anonymisiert auszuwerten, um unsere Angebote stetig zu verbessern.
                        </p>
                      </div>
                      <button
                        type="button"
                        className={`h-5 w-10 flex items-center rounded-full transition-colors flex-shrink-0 relative ${preferences.statistics ? 'bg-black' : 'bg-gray-200'}`}
                      >
                        <span className={`h-4 w-4 rounded-full bg-white transition-all absolute left-0.5 shadow-sm ${preferences.statistics ? 'translate-x-5' : ''}`}></span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              {showDetails ? (
                <>
                  <button
                    onClick={handleSaveSelection}
                    className="flex-1 bg-black hover:bg-gray-900 text-white font-bold text-xs py-3 rounded-full transition-all active:scale-95 shadow-sm"
                  >
                    Auswahl speichern
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-3 rounded-full transition-all active:scale-95 border border-gray-200"
                  >
                    Alle erlauben
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAcceptEssential}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs py-3 rounded-full transition-all active:scale-95 border border-gray-200 order-2 sm:order-1"
                  >
                    Nur funktionale
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 bg-black hover:bg-gray-900 text-white font-bold text-xs py-3 rounded-full transition-all active:scale-95 shadow-md order-1 sm:order-2"
                  >
                    Alle akzeptieren
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
