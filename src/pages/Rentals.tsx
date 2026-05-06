import { useState, useEffect } from 'react';
import { RENTALS } from '@/src/constants';
import ListingCard from '@/src/components/ListingCard';
import { useNavigate } from 'react-router-dom';
import { db } from '@/src/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

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
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
