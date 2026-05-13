import { useState, useEffect } from 'react';
import { RENTALS } from '@/src/constants';
import ListingCard from '@/src/components/ListingCard';
import { useNavigate } from 'react-router-dom';
import { db } from '@/src/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

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
    <div className="mt-2">
      <h3 className="font-bold text-[15px] leading-tight text-gray-500 mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">Usedom</p>
    </div>
  </div>
);

export default function Rentals() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, 'listings'), 
          where('type', '==', 'rental')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        // If DB is empty, use static data for now (helpful for initial preview)
        setItems(data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
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
          <h1 className="text-3xl font-bold mb-4 tracking-tight">Ferienwohnungen auf Usedom</h1>
          <p className="text-text-secondary text-lg">Entdecken Sie unsere handverlesenen Unterkünfte für Ihren perfekten Ostseeurlaub.</p>
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
                onClick={() => { navigate(`/ferienwohnungen/${listing.id}`); }}
              />
            ))}
            {/* Fixed Teaser #3 for Rentals */}
            <TeaserCard title="Exklusives Strand Apartment" imgUrl="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80" />
          </div>
        )}
        
        <div className="mt-20 p-12 bg-gray-50 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Nichts passendes gefunden?</h2>
          <p className="text-text-secondary mb-8">Kontaktieren Sie uns direkt, wir helfen Ihnen gerne persönlich weiter.</p>
          <button 
            onClick={() => window.location.href = 'mailto:info@strandnah-usedom.de?subject=Allgemeine Anfrage zu Ferienwohnungen'}
            className="bg-black text-white px-8 py-3 rounded-xl font-bold"
          >
            Anfrage senden
          </button>
        </div>
      </div>
    </div>
  );
}
