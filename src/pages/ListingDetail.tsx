import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RENTALS, SALES } from '@/src/constants';
import ImageGallery from '@/src/components/ImageGallery';
import BookingCalendar from '@/src/components/BookingCalendar';
import PricingTable from '@/src/components/PricingTable';
import { calculateBookingDetails, getPriceForDate, SEASONS } from '@/src/lib/pricing';
import { Shield, Medal, MapPin, Coffee, Car, Wifi, Check, MessageCircle, Loader2, Users } from 'lucide-react';
import { db } from '@/src/lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AREA_LABELS: Record<string, string> = {
  livingRoom: 'Wohnzimmer',
  kitchen: 'Küche',
  dining: 'Essbereich',
  bedroom1: 'Schlafzimmer 1',
  bedroom2: 'Schlafzimmer 2',
  bedroom3: 'Schlafzimmer 3',
  bathroom: 'Badezimmer',
  guestWc: 'Gäste WC',
  outdoor: 'Aussenbereich'
};

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null);
  const [guests, setGuests] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

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

  const calculateNights = () => {
    if (!selectedRange || !selectedRange[0] || !selectedRange[1]) return 0;
    const diffTime = Math.abs(selectedRange[1].getTime() - selectedRange[0].getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPriceNumber = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
  };

  const booking = selectedRange && selectedRange[0] && selectedRange[1] 
    ? calculateBookingDetails(selectedRange[0], selectedRange[1], guests)
    : null;

  const nights = booking?.numNights || 0;
  const subtotal = booking?.totalBasePrice || 0;
  const cleaningFee = listing?.type === 'rental' ? (booking?.cleaningFee || 70) : 0;
  const kurtaxe = listing?.type === 'rental' ? (booking?.kurtaxe || 0) : 0;
  const linenFee = listing?.type === 'rental' ? (booking?.linenFee || 0) : 0;
  const serviceFee = booking?.serviceFee || 0;
  const total = booking?.total || 0;

  // Check minimum stay
  const getMinNights = () => {
    if (!selectedRange || !selectedRange[0]) return 0;
    const date = selectedRange[0];
    const month = date.getMonth();
    const day = date.getDate();
    const currentVal = month * 100 + day;

    for (const season of SEASONS) {
      for (const period of season.periods) {
        const startVal = period.start.month * 100 + period.start.day;
        const endVal = period.end.month * 100 + period.end.day;
        if (startVal <= endVal) {
          if (currentVal >= startVal && currentVal <= endVal) return period.minNights;
        } else {
          if (currentVal >= startVal || currentVal <= endVal) return period.minNights;
        }
      }
    }
    return 3; // Default
  };

  const minNightsRequired = getMinNights();
  const isMinStayMet = nights >= minNightsRequired;

  const currentPricePerNight = selectedRange && selectedRange[0] 
    ? getPriceForDate(selectedRange[0]) 
    : (listing ? getPriceNumber(listing.price) : 0);

  const handleReserve = async () => {
    if (!selectedRange) {
      // If no range selected, scroll to calendar
      const calendar = document.querySelector('.calendar-container');
      calendar?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!isMinStayMet && listing.type === 'rental') {
      alert(`Mindestaufenthalt für diesen Zeitraum sind ${minNightsRequired} Nächte.`);
      return;
    }
    
    setReserving(true);
    setError(null);

    try {
      // Save booking to Firestore
      if (listing.type === 'rental') {
        const bookingsRef = collection(db, 'bookings');
        await addDoc(bookingsRef, {
          listingId: listing.id,
          startDate: selectedRange[0].toISOString(),
          endDate: selectedRange[1].toISOString(),
          guests,
          totalPrice: total,
          status: 'pending',
          createdAt: serverTimestamp()
        });
      }

      setShowSuccess(true);
      setTimeout(() => {
        const subject = encodeURIComponent(`Buchungsanfrage für: ${listing.title}`);
        const body = encodeURIComponent(`Hallo Team von Strandnah Usedom,\n\nich möchte "${listing.title}" für den Zeitraum vom ${selectedRange[0].toLocaleDateString('de-DE')} bis zum ${selectedRange[1].toLocaleDateString('de-DE')} für ${guests} Person(en) anfragen.\n\nPreisübersicht:\n${nights} Nächte: ${subtotal} €\nEndreinigung: ${cleaningFee} €\nWäschepaket: ${linenFee} €\nKurtaxe: ${kurtaxe} €\nService: ${serviceFee} €\nGesamt: ${total} €\n\nBitte bestätigen Sie mir die Verfügbarkeit.\n\nMit freundlichen Grüßen`);
        window.location.href = `mailto:info@strandnah-usedom.de?subject=${subject}&body=${body}`;
      }, 2000);
    } catch (err: any) {
      console.error("Error creating booking:", err);
      setError("Es gab ein Problem bei der Reservierung. Bitte versuchen Sie es später erneut.");
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div className="pt-40 text-center animate-pulse">Lade Objekt-Details...</div>;
  if (!listing) return <div className="pt-40 text-center">Objekt nicht gefunden.</div>;

  return (
    <div className="pt-24 pb-20">
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-md w-full shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Anfrage gesendet!</h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              Vielen Dank für dein Interesse. Wir leiten dich nun zu deiner E-Mail App weiter, um die Anfrage abzuschließen.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

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

            <div className="py-8 border-b border-border-light">
              <h3 className="text-xl font-bold mb-6">Räume & Bereiche</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
                {Object.entries(AREA_LABELS).map(([key, label]) => {
                  const imgUrl = listing.areaImages?.[key] || `https://placehold.co/600x400/eeeeee/999999?text=${encodeURIComponent(label)}`;
                  return (
                    <div key={key} className="min-w-[200px] sm:min-w-[250px] snap-start flex-shrink-0">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-gray-100">
                         <img src={imgUrl} className="w-full h-full object-cover" alt={label} />
                      </div>
                      <h4 className="font-semibold text-text-primary">{label}</h4>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="py-8 border-b border-border-light">
              <h3 className="text-xl font-bold mb-6">Was bietet dir diese Unterkunft</h3>
              {listing.amenities && listing.amenities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.amenities.map((amenity: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                       <Check size={20} className="text-gray-400" />
                       <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary italic">Die Ausstattungsmerkmale werden demnächst ergänzt.</p>
              )}
            </div>

            {listing.type === 'sale' && listing.pdfLinks && listing.pdfLinks.length > 0 && (
              <div className="py-8 border-b border-border-light">
                <h3 className="text-xl font-bold mb-6">Dokumente & Grundrisse</h3>
                <div className="flex flex-wrap gap-4">
                  {listing.pdfLinks.map((link: string, i: number) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-black rounded-xl px-6 py-3 font-semibold hover:bg-gray-50 transition-colors">
                       📄 Dokument {i + 1} ansehen
                    </a>
                  ))}
                </div>
              </div>
            )}

            {listing.type === 'rental' && <PricingTable />}

          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="p-6 rounded-2xl border border-border-main shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold">{currentPricePerNight} €</span>
                    {listing.type === 'rental' && <span className="text-text-secondary"> / Nacht</span>}
                  </div>
                </div>

                <div className="border border-gray-300 rounded-xl overflow-visible mb-4 hover:border-airbnb-red transition-colors duration-300 relative">
                  <div 
                    className="grid grid-cols-2 border-b border-gray-300 cursor-pointer"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <div className="p-3 border-r border-gray-300 hover:bg-gray-50 transition-colors">
                      <p className="text-[10px] font-bold uppercase text-gray-500">Check-in</p>
                      <p className="text-sm font-medium">
                        {selectedRange?.[0] ? selectedRange[0].toLocaleDateString('de-DE') : 'Datum wählen'}
                      </p>
                    </div>
                    <div className="p-3 hover:bg-gray-50 transition-colors">
                      <p className="text-[10px] font-bold uppercase text-gray-500">Check-out</p>
                      <p className="text-sm font-medium">
                        {selectedRange?.[1] ? selectedRange[1].toLocaleDateString('de-DE') : 'Datum wählen'}
                      </p>
                    </div>
                  </div>
                  {showCalendar && (
                    <div className="absolute top-[80px] left-0 md:-left-[20px] w-full md:w-[400px] z-[100] bg-white rounded-2xl shadow-2xl">
                      <BookingCalendar 
                        listingId={listing.id} 
                        icalUrl={listing.icalUrl} 
                        onDateChange={(range) => {
                          setSelectedRange(range);
                          if (range && range[0] && range[1]) {
                            setShowCalendar(false);
                          }
                        }} 
                      />
                      <div className="p-4 border-t border-gray-100 flex justify-end bg-white rounded-b-2xl">
                        <button 
                          onClick={() => setShowCalendar(false)} 
                          className="bg-black text-white px-6 py-2 rounded-xl font-bold"
                        >
                          Fertig
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="p-3 relative group hover:bg-gray-50 transition-colors">
                    <p className="text-[10px] font-bold uppercase text-airbnb-red">Personenanzahl</p>
                    <div className="flex items-center">
                      <select 
                        value={guests} 
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-full text-base font-medium bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none pr-8"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num} className="text-black">
                            {num} {num === 1 ? 'Gast' : 'Gäste'}
                          </option>
                        ))}
                      </select>
                      <Users 
                        size={18} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-airbnb-red opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleReserve}
                  disabled={reserving || !!error}
                  className="w-full bg-airbnb-red text-white py-3 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-colors mb-2 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {reserving ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Wird verarbeitet...
                    </>
                  ) : (
                    listing.type === 'rental' 
                      ? 'Buchungsanfrage' 
                      : 'Anfrage'
                  )}
                </button>

                {error && (
                  <p className="text-red-500 text-xs text-center mb-4">{error}</p>
                )}

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
                
                {listing.type === 'rental' && selectedRange && booking && (
                  <div className="space-y-3 pt-4 animate-in fade-in slide-in-from-top-2 duration-500 border-t border-border-light">
                    {!isMinStayMet && (
                      <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2 mb-4">
                        <Shield size={14} />
                        <span>Mindestaufenthalt: {minNightsRequired} Nächte erforderlich.</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between underline text-text-secondary">
                      <span>Ø {Math.round(subtotal / nights)} € x {nights} Nächte</span>
                      <span>{subtotal.toLocaleString('de-DE')} €</span>
                    </div>
                    <div className="flex items-center justify-between underline text-text-secondary">
                      <span>Endreinigung</span>
                      <span>{cleaningFee.toLocaleString('de-DE')} €</span>
                    </div>
                    <div className="flex items-center justify-between underline text-text-secondary">
                      <span>Wäscheset</span>
                      <span>{linenFee.toLocaleString('de-DE')} €</span>
                    </div>
                    <div className="flex items-center justify-between underline text-text-secondary">
                      <span>Kurtaxe</span>
                      <span>{kurtaxe.toLocaleString('de-DE')} €</span>
                    </div>
                    {serviceFee > 0 && (
                      <div className="flex items-center justify-between underline text-text-secondary">
                        <span>Servicegebühr</span>
                        <span>{serviceFee.toLocaleString('de-DE')} €</span>
                      </div>
                    )}
                    <div className="pt-4 border-t border-border-light flex items-center justify-between font-bold text-lg">
                      <span>Gesamt</span>
                      <span>{total.toLocaleString('de-DE')} €</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
