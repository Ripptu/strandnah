import { useState, useEffect } from 'react';
import { SALES } from '@/src/constants';
import ListingCard from '@/src/components/ListingCard';
import { useNavigate } from 'react-router-dom';
import { db } from '@/src/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function Sales() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, 'listings'), 
          where('type', '==', 'sale')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-4 tracking-tight">Eigentumswohnungen zum Verkauf</h1>
          <p className="text-text-secondary text-lg">Invertieren Sie in Ihre Zukunft an der Ostsee. Exklusive Objekte in Top-Lagen.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-airbnb-red"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {items.map((listing) => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                onClick={() => { navigate(`/eigentumswohnungen/${listing.id}`); }}
              />
            ))}
          </div>
        )}

        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-t border-border-light pt-24">
          <div>
            <h2 className="text-3xl font-bold mb-6">Ihr Partner für Immobilien auf Usedom</h2>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Seit über 15 Jahren begleiten wir Käufer und Verkäufer bei der Realisierung ihrer Immobilienträume. 
              Wir kennen den Markt auf Usedom wie kaum ein anderer und bieten Ihnen eine umfassende Beratung – 
              von der ersten Besichtigung bis zum Notartermin.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-airbnb-red/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-airbnb-red"></div>
                </div>
                <span className="font-semibold">Marktgerechte Bewertung</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-airbnb-red/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-airbnb-red"></div>
                </div>
                <span className="font-semibold">Exklusives Portfolio</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-airbnb-red/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-airbnb-red"></div>
                </div>
                <span className="font-semibold">Finanzierungsvermittlung</span>
              </li>
            </ul>
          </div>
          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover" 
              alt="Real Estate Partner" 
            />
          </div>
        </section>
        
        <div className="mt-20 p-12 bg-gray-50 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Interesse an einer Kapitalanlage?</h2>
          <p className="text-text-secondary mb-8">Kontaktieren Sie unsere Immobilienexperten für ein individuelles Beratungsgespräch.</p>
          <button 
            onClick={() => window.location.href = 'mailto:info@strandnah-usedom.de?subject=Anfrage zu Eigentumswohnungen'}
            className="bg-black text-white px-8 py-3 rounded-xl font-bold"
          >
            Anfrage senden
          </button>
        </div>
      </div>
    </div>
  );
}
