import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RENTALS, SALES } from '@/src/constants';
import ImageGallery from '@/src/components/ImageGallery';
import BookingCalendar from '@/src/components/BookingCalendar';
import { Shield, Medal, MapPin, Coffee, Car, Wifi, Check, MessageCircle } from 'lucide-react';
import { db } from '@/src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, 'listings', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
        } else {
          setListing(null);
        }
      } catch (error) {
        console.error("Error fetching listing detail:", error);
        setListing(null);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <div className="pt-40 text-center animate-pulse">Lade Objekt-Details...</div>;
  if (!listing) return <div className="pt-40 text-center">Objekt nicht gefunden.</div>;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{listing.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span>{listing.location}</span>
            </div>
          </div>
        </header>

        <ImageGallery images={listing.images} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="border-b border-border-light pb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Objekt von Strandnah Usedom</h2>
                <p className="text-text-secondary">{listing.features.join(' · ')}</p>
              </div>
            </div>

            <div className="py-8 border-b border-border-light space-y-6">
              <div className="flex items-start gap-4">
                <Medal size={28} className="mt-1" />
                <div>
                  <p className="font-bold">Super-Hosting-Service</p>
                  <p className="text-text-secondary text-sm">Wir sind erfahren und bestbewertet auf Usedom.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin size={28} className="mt-1" />
                <div>
                  <p className="font-bold">Tolle Lage</p>
                  <p className="text-text-secondary text-sm">95 % der Gäste haben die Lage mit 5 Sternen bewertet.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield size={28} className="mt-1" />
                <div>
                  <p className="font-bold">Kostenlose Stornierung</p>
                  <p className="text-text-secondary text-sm">Bis zu 48 Stunden vor Check-in.</p>
                </div>
              </div>
            </div>

            <div className="py-8 border-b border-border-light">
              <h3 className="text-xl font-bold mb-4">Über diese Unterkunft</h3>
              <p className="text-text-primary leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            <div className="py-8">
              <h3 className="text-xl font-bold mb-6">Was diese Unterkunft bietet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.amenities?.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 text-text-primary">
                    <Check size={20} className="text-green-600" />
                    <span>{amenity}</span>
                  </div>
                ))}
                {(!listing.amenities || listing.amenities.length === 0) && (
                  <p className="text-text-secondary text-sm italic">Keine besonderen Ausstattungsmerkmale angegeben.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="p-6 rounded-2xl border border-border-main shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold">{listing.price}</span>
                    {listing.type === 'rental' && <span className="text-text-secondary"> / Nacht</span>}
                  </div>
                </div>

                <div className="border border-gray-400 rounded-xl overflow-hidden mb-4">
                  <div className="grid grid-cols-2 border-b border-gray-400">
                    <div className="p-3 border-r border-gray-400">
                      <p className="text-[10px] font-bold uppercase">Check-in</p>
                      <p className="text-sm">01.06.2026</p>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold uppercase">Check-out</p>
                      <p className="text-sm">08.06.2026</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase">Gäste</p>
                    <p className="text-sm">1 Gast</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const subject = encodeURIComponent(`Anfrage für: ${listing.title} (${listing.location})`);
                    const body = encodeURIComponent(`Hallo Team von Strandnah Usedom,\n\nich interessiere mich für das Objekt "${listing.title}" in ${listing.location} (${listing.price}).\n\nBitte senden Sie mir weitere Informationen.\n\nMit freundlichen Grüßen`);
                    window.location.href = `mailto:info@strandnah-usedom.de?subject=${subject}&body=${body}`;
                  }}
                  className="w-full bg-airbnb-red text-white py-3 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-colors mb-2"
                >
                  {listing.type === 'rental' ? 'Reservierungsanfrage' : 'Exposé anfordern'}
                </button>

                <a 
                  href={`https://wa.me/4915565224488?text=${encodeURIComponent(`Hallo, ich interessiere mich für das Objekt: ${listing.title} in ${listing.location}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-black text-black py-3 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors mb-4 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} className="text-green-600" />
                  WhatsApp Anfrage
                </a>
                <p className="text-center text-sm text-text-secondary mb-4">Dir wird noch nichts berechnet</p>
                
                {listing.type === 'rental' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between underline text-text-secondary">
                      <span>{listing.price} x 7 Nächte</span>
                      <span>1.015 €</span>
                    </div>
                    <div className="flex items-center justify-between underline text-text-secondary">
                      <span>Reinigungsgebühr</span>
                      <span>80 €</span>
                    </div>
                    <div className="flex items-center justify-between underline text-text-secondary">
                      <span>Servicegebühr</span>
                      <span>140 €</span>
                    </div>
                    <div className="pt-4 border-t border-border-light flex items-center justify-between font-bold text-lg">
                      <span>Gesamt</span>
                      <span>1.235 €</span>
                    </div>
                  </div>
                )}
              </div>

              <BookingCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
