import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, MapPin } from 'lucide-react';
import { cn } from '@/src/lib/utils';

import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

const HERO_IMAGES = [
  'https://s1.directupload.eu/images/260506/bzioxhyn.webp',
  'https://s1.directupload.eu/images/260506/6yorps8l.webp',
  'https://s1.directupload.eu/images/260506/qg3trvbx.webp'
];

const TeaserCard = ({ title, imgUrl }: { title: string, imgUrl: string }) => (
  <div className="group cursor-default relative">
    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-gray-200 shadow-sm relative">
      <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-[2px]">
        <div className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-6 py-2 rounded-full font-bold tracking-widest uppercase text-sm">
          Demnächst
        </div>
      </div>
      <img src={imgUrl} className="w-full h-full object-cover grayscale" alt="Teaser" />
    </div>
    <h3 className="font-bold text-lg text-gray-500">{title}</h3>
    <p className="text-gray-400">Usedom</p>
  </div>
);

export default function Home() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const rentalsQuery = query(collection(db, 'listings'), where('type', '==', 'rental'), limit(2));
        const salesQuery = query(collection(db, 'listings'), where('type', '==', 'sale'), limit(2));
        
        const [rentalsSnap, salesSnap] = await Promise.all([getDocs(rentalsQuery), getDocs(salesQuery)]);
        
        setRentals(rentalsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        setSales(salesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching featured:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
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

      {/* Featured Rentals */}
      <section className="bg-[#F7F7F7] py-24 border-t border-gray-200">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Unsere Ferienwohnungen</h2>
              <p className="text-text-secondary">Entdecken Sie gemütliche Rückzugsorte für Ihren Urlaub.</p>
            </div>
            <Link to="/ferienwohnungen" className="text-sm font-semibold underline text-text-secondary hover:text-black">
              Alle Ferienwohnungen anzeigen
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p>Lade Ferienwohnungen...</p>
            ) : (
              <>
                {rentals.map((item) => (
                  <Link key={item.id} to={`/ferienwohnungen/${item.id}`} className="group cursor-pointer">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-sm">
                      <img 
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80'} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={item.title} 
                      />
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-airbnb-red transition-colors">{item.title}</h3>
                    <p className="text-text-secondary">{item.location}</p>
                  </Link>
                ))}
                {/* Fixed Teaser #3 for Rentals */}
                <TeaserCard title="Exklusives Strand Apartment" imgUrl="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Sales */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Eigentumswohnungen</h2>
              <p className="text-text-secondary">Exklusive Immobilien als Ihr neues Zuhause oder Investment.</p>
            </div>
            <Link to="/eigentumswohnungen" className="text-sm font-semibold underline text-text-secondary hover:text-black">
              Alle Angebote anzeigen
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p>Lade Eigentumswohnungen...</p>
            ) : (
              <>
                {sales.map((item) => (
                  <Link key={item.id} to={`/eigentumswohnungen/${item.id}`} className="group cursor-pointer">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-sm">
                      <img 
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80'} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={item.title} 
                      />
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-airbnb-red transition-colors">{item.title}</h3>
                    <p className="text-text-secondary">{item.location}</p>
                  </Link>
                ))}
                {/* Fixed Teaser #3 for Sales */}
                <TeaserCard title="Premium Penthouse Projekt" imgUrl="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Location / Map Section */}
      <section className="bg-gray-900 text-white py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hier finden Sie uns</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Unser Büro befindet sich zentral in Ahlbeck. Kommen Sie gerne auf einen Kaffee vorbei und wir besprechen Ihre Wünsche rund um Ihre Wunschimmobilie auf Usedom.
            </p>
          </div>
          
          <div className="rounded-3xl overflow-hidden h-[450px] shadow-2xl border border-gray-800 relative max-w-5xl mx-auto">
            <iframe 
              src="https://maps.google.com/maps?q=Lindenstra%C3%9Fe%2082,%2017419%20Seebad%20Ahlbeck&t=&z=11&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-medium">
              <MapPin size={16} className="text-airbnb-red" />
              <span className="text-sm">Lindenstraße 82, Ahlbeck</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
