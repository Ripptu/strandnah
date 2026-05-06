import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

const HERO_IMAGES = [
  'https://s1.directupload.eu/images/260506/bzioxhyn.webp',
  'https://s1.directupload.eu/images/260506/6yorps8l.webp',
  'https://s1.directupload.eu/images/260506/qg3trvbx.webp'
];

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'listings'), limit(2));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeatured(data);
      } catch (error) {
        console.error("Error fetching featured:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 2, ease: "easeInOut" },
                scale: { duration: 8, ease: "linear" }
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={HERO_IMAGES[currentImageIndex]}
                className="w-full h-full object-cover"
                alt="Usedom Impression"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 max-w-4xl"
          >
            Fühlen Sie sich auf Usedom wie zu Hause.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg md:text-2xl font-light mb-10 max-w-2xl opacity-90"
          >
            Exklusive Ferienwohnungen und Immobilien direkt an der Ostseeküste.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              to="/ferienwohnungen" 
              className="bg-airbnb-red text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Buchungsanfrage stellen
            </Link>
            <Link 
              to="/kontakt" 
              className="bg-white text-text-primary px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Kontakt aufnehmen
            </Link>
          </motion.div>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={cn(
                "h-1 transition-all duration-500 rounded-full",
                currentImageIndex === idx ? "w-12 bg-white" : "w-6 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">Erholung in ihrer feinsten Form.</h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Die Insel Usedom besticht durch ihre einzigartige Bäderarchitektur, feinsandige Strände und unberührte Natur. 
              Wir bieten Ihnen die passende Unterkunft für einen unvergesslichen Urlaub oder helfen Ihnen dabei, 
              Ihre eigene Traumimmobilie am Meer zu finden.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-text-primary">
                  <Star className="text-airbnb-red" size={20} fill="#FF5A5F" />
                  <span>Premium Service</span>
                </div>
                <span className="text-sm text-text-secondary">Persönliche Betreuung vor Ort.</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-text-primary">
                  <ShieldCheck className="text-airbnb-red" size={20} />
                  <span>Sicherheit</span>
                </div>
                <span className="text-sm text-text-secondary">Geprüfte Qualität in allen Objekten.</span>
              </div>
            </div>
            <Link to="/ferienwohnungen" className="mt-12 inline-flex items-center gap-2 text-lg font-bold border-b-2 border-black pb-1 hover:opacity-70 transition-opacity">
              Alle Ferienwohnungen entdecken
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="relative aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover rounded-3xl shadow-2xl" 
              alt="Usedom Lifestyle" 
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold">15+</div>
                <div>
                  <p className="font-bold">Jahre Erfahrung</p>
                  <p className="text-xs text-text-secondary">Ihr Experte auf Usedom</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Preview */}
      <section className="bg-[#F7F7F7] py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Exklusive Angebote</h2>
              <p className="text-text-secondary">Entdecken Sie unsere Highlights der Saison.</p>
            </div>
            <Link to="/eigentumswohnungen" className="text-sm font-semibold underline">Alle Angebote anzeigen</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {loading ? (
              <p>Lade Angebote...</p>
            ) : featured.length > 0 ? (
              featured.map((item) => (
                <Link key={item.id} to="/ferienwohnungen" className="group cursor-pointer">
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-sm">
                    <img 
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80'} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={item.title} 
                    />
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-text-secondary">{item.location}</p>
                </Link>
              ))
            ) : (
              <p className="text-text-secondary italic">Keine exklusiven Angebote vorhanden. Fügen Sie welche im Admin-Panel hinzu.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
