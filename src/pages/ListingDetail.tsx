import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RENTALS, SALES, AREA_LABELS } from '@/src/constants';
import ImageGallery, { ImageGalleryRef } from '@/src/components/ImageGallery';
import BookingCalendar from '@/src/components/BookingCalendar';
import PricingTable from '@/src/components/PricingTable';
import { calculateBookingDetails, getPriceForDate, SEASONS } from '@/src/lib/pricing';
import { Shield, Medal, MapPin, Coffee, Car, Wifi, Check, MessageCircle, Loader2, Users, X } from 'lucide-react';
import { db } from '@/src/lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';



const FALLBACK_AREA_IMAGES: Record<string, string> = {
  livingRoom: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80',
  kitchen: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80',
  bedroom1: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80',
  dining: 'https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&q=80',
  bathroom: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80',
  outdoor: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80',
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
  const galleryRef = useRef<ImageGalleryRef>(null);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [bringOwnLinen, setBringOwnLinen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    zip: '',
    city: '',
    remarks: '',
    privacyAccepted: false,
    agbAccepted: false,
    emailCopy: false,
    subject: 'rental',
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

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

  const calculateNights = () => {
    if (!selectedRange || !selectedRange[0] || !selectedRange[1]) return 0;
    const diffTime = Math.abs(selectedRange[1].getTime() - selectedRange[0].getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPriceNumber = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
  };

  const booking = selectedRange && selectedRange[0] && selectedRange[1] 
    ? calculateBookingDetails(selectedRange[0], selectedRange[1], guests, listing?.seasonalPrices)
    : null;

  const nights = booking?.numNights || 0;
  const subtotal = booking?.totalBasePrice || 0;
  const cleaningFee = listing?.type === 'rental' ? (booking?.cleaningFee || 70) : 0;
  const kurtaxe = listing?.type === 'rental' ? (booking?.kurtaxe || 0) : 0;
  const linenFee = listing?.type === 'rental' && !bringOwnLinen ? (booking?.linenFee || (guests * 20)) : 0;
  const serviceFee = booking?.serviceFee || 0;
  const total = listing?.type === 'rental' ? (subtotal + cleaningFee + kurtaxe + linenFee + serviceFee) : 0;

  const formatPrice = (val: number): string => {
    return val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  };

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

  const currentPricePerNight = selectedRange && selectedRange[0] && listing?.type === 'rental'
    ? getPriceForDate(selectedRange[0], listing?.seasonalPrices) 
    : (listing?.type === 'rental' ? getPriceForDate(new Date(), listing?.seasonalPrices) : (listing ? getPriceNumber(listing.price) : 0));

  const handleReserve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (listing.type === 'rental') {
      if (!selectedRange) {
        const calendar = document.querySelector('.calendar-container');
        calendar?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!isMinStayMet) {
        alert(`Mindestaufenthalt für diesen Zeitraum sind ${minNightsRequired} Nächte.`);
        return;
      }
    }
    
    setReserving(true);
    setError(null);

    try {
      if (listing.type === 'rental' && selectedRange) {
        const bookingsRef = collection(db, 'bookings');
        await addDoc(bookingsRef, {
          listingId: listing.id,
          startDate: selectedRange[0].toISOString(),
          endDate: selectedRange[1].toISOString(),
          guests,
          totalPrice: total,
          includeLinen: !bringOwnLinen,
          contact: formData,
          status: 'pending',
          createdAt: serverTimestamp()
        });
      } else if (listing.type === 'sale') {
        await addDoc(collection(db, 'requests'), {
          listingId: listing.id,
          contact: formData,
          createdAt: serverTimestamp()
        });
      }

      setShowSuccess(true);
      // Removed local email client opening (window.location.href = mailto:...) so the booking runs entirely in the background.
    } catch (err: any) {
      console.error("Error creating booking:", err);
      setError("Es gab ein Problem bei der Versendung. Bitte versuchen Sie es später erneut.");
    } finally {
      setReserving(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      {showAmenitiesModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAmenitiesModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold">Was diese Unterkunft bietet</h2>
              <button onClick={() => setShowAmenitiesModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto w-full no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {[...(listing.amenities || [])].sort((a, b) => a.localeCompare(b)).map((amenity: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0 md:last:border-b-0">
                    <Check size={24} className="text-black" />
                    <span className="text-lg text-text-primary">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-md w-full shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Anfrage gesendet!</h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              Vielen Dank für Ihre Anfrage! Wir haben Ihre Daten erhalten, prüfen die Verfügbarkeit und melden uns in Kürze bei Ihnen.
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

        <ImageGallery listing={listing} ref={galleryRef} />

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

            {listing.areaImages && Object.values(listing.areaImages).filter(img => img && (Array.isArray(img) ? img.length > 0 : true)).length > 0 && (
              <div className="py-8 border-b border-border-light">
                <h3 className="text-xl font-bold mb-6">Räume & Bereiche</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Object.entries(AREA_LABELS)
                    .filter(([key]) => !!listing.areaImages?.[key] && (Array.isArray(listing.areaImages?.[key]) ? (listing.areaImages[key] as string[]).length > 0 : true))
                    .map(([key, label]) => {
                      const imgData = listing.areaImages[key];
                      const imgs = Array.isArray(imgData) ? imgData : [imgData];
                      const mainImg = imgs[0];
                      return (
                        <div key={key} className="w-full relative group cursor-pointer" onClick={() => galleryRef.current?.openGallery(key)}>
                          <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 border border-gray-100 relative bg-gray-50">
                            <img src={mainImg} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={label} />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                          <h4 className="font-medium text-sm text-text-primary group-hover:text-airbnb-red transition-colors">{label}</h4>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            <div className="py-8 border-b border-border-light">
              <h3 className="text-xl font-bold mb-6">Was bietet dir diese Unterkunft</h3>
              {listing.amenities && listing.amenities.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {listing.amenities.slice(0, 10).map((amenity: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                         <Check size={20} className="text-gray-400" />
                         <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                  {listing.amenities.length > 10 && (
                    <button 
                      onClick={() => setShowAmenitiesModal(true)}
                      className="border border-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Alle {listing.amenities.length} Ausstattungsmerkmale anzeigen
                    </button>
                  )}
                </>
              ) : (
                <p className="text-text-secondary italic">Die Ausstattungsmerkmale werden demnächst ergänzt.</p>
              )}
            </div>

            {listing.type === 'sale' && listing.pdfLinks && listing.pdfLinks.length > 0 && (
              <div className="py-8 border-b border-border-light">
                <h3 className="text-xl font-bold mb-6">Dokumente & Grundrisse</h3>
                <div className="flex flex-col gap-3 max-w-md">
                  {listing.pdfLinks.map((linkObj: any, i: number) => {
                    const isString = typeof linkObj === 'string';
                    const url = isString ? linkObj : (linkObj.url || '');
                    const customTitle = isString ? '' : (linkObj.title || '');

                    const getPdfName = (urlToParse: string, index: number) => {
                      if (customTitle) return customTitle;
                      try {
                        const decoded = decodeURIComponent(urlToParse);
                        const lastSlash = decoded.lastIndexOf('/');
                        let filename = lastSlash !== -1 ? decoded.substring(lastSlash + 1) : decoded;
                        
                        const qIndex = filename.indexOf('?');
                        if (qIndex !== -1) {
                          filename = filename.substring(0, qIndex);
                        }
                        
                        const partSlash = filename.lastIndexOf('/');
                        if (partSlash !== -1) {
                          filename = filename.substring(partSlash + 1);
                        }
                        
                        const oIndex = filename.indexOf('listings/');
                        if (oIndex !== -1) {
                          filename = filename.substring(oIndex + 9);
                        }
                        const tokenIndex = filename.lastIndexOf('/');
                        if (tokenIndex !== -1) {
                          filename = filename.substring(tokenIndex + 1);
                        }

                        const cleanFilename = filename.replace(/^[a-f0-9-]{36}_/, '');
                        let clean = cleanFilename.replace(/\.pdf$/i, '').replace(/_/g, ' ').replace(/-/g, ' ').trim();
                        
                        if (clean && clean.length > 3 && !clean.toLowerCase().includes('firebase')) {
                          return clean.charAt(0).toUpperCase() + clean.slice(1) + ' (PDF)';
                        }
                      } catch (e) {
                        console.warn(e);
                      }
                      
                      const fallbackNames = [
                        'Grundriss Erdgeschoss – Wohnung 1 (PDF)',
                        'Schnitt & Aufriss Vorderhaus (PDF)',
                        'Exposé Objekt (PDF)',
                        'Lageplan & Flurkarte (PDF)'
                      ];
                      return fallbackNames[index] || `Dokument ${index + 1} (PDF)`;
                    };

                    return (
                      <a 
                        key={i} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 border border-black rounded-xl px-6 py-4 font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <span className="text-xl">📄</span>
                        <span className="text-sm">{getPdfName(url, i)}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {listing.type === 'rental' && <PricingTable seasonalPrices={listing.seasonalPrices} />}

          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="p-6 rounded-2xl border border-border-main shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {listing.type === 'rental' ? 'Buchungsanfrage' : 'Kaufinteresse Anfrage'}
                    </h3>
                  </div>
                </div>

                {listing.type === 'rental' && (
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
                )}

                <form onSubmit={handleReserve}>
                  <div className="space-y-4 mb-6 mt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Vorname" className="p-3 border border-gray-300 rounded-xl focus:border-airbnb-red focus:ring-1 focus:ring-airbnb-red focus:outline-none" />
                      <input required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Nachname" className="p-3 border border-gray-300 rounded-xl focus:border-airbnb-red focus:ring-1 focus:ring-airbnb-red focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Telefon" className="p-3 border border-gray-300 rounded-xl focus:border-airbnb-red focus:ring-1 focus:ring-airbnb-red focus:outline-none" />
                      <input required name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="E-Mail" className="p-3 border border-gray-300 rounded-xl focus:border-airbnb-red focus:ring-1 focus:ring-airbnb-red focus:outline-none" />
                    </div>
                    {listing.type === 'sale' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Ich interessiere mich für:</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject || 'sale_self'}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:border-airbnb-red focus:ring-1 focus:ring-airbnb-red focus:outline-none text-sm text-text-primary bg-white cursor-pointer"
                        >
                          <option value="sale_self">Kaufinteresse (zur Eigennutzung)</option>
                          <option value="sale_investment">Kaufinteresse (als Kapitalanlage)</option>
                        </select>
                      </div>
                    )}
                    <input required name="street" value={formData.street} onChange={handleInputChange} placeholder="Straße u. Hausnummer" className="p-3 border border-gray-300 rounded-xl w-full focus:border-airbnb-red focus:ring-1 focus:ring-airbnb-red focus:outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <input required name="zip" value={formData.zip} onChange={handleInputChange} placeholder="PLZ" className="p-3 border border-gray-300 rounded-xl focus:border-airbnb-red focus:ring-1 focus:ring-airbnb-red focus:outline-none" />
                      <input required name="city" value={formData.city} onChange={handleInputChange} placeholder="Ort" className="p-3 border border-gray-300 rounded-xl focus:border-airbnb-red focus:ring-1 focus:ring-airbnb-red focus:outline-none" />
                    </div>
                    <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="Bemerkung (optional)" className="p-3 border border-gray-300 rounded-xl w-full h-24 resize-none focus:border-airbnb-red focus:ring-1 focus:ring-airbnb-red focus:outline-none" />
                    
                    {listing.type === 'rental' && (
                      <label className="flex items-start gap-3 mt-4 text-[11px] text-text-secondary cursor-pointer leading-tight">
                        <input 
                          type="checkbox" 
                          checked={bringOwnLinen} 
                          onChange={(e) => setBringOwnLinen(e.target.checked)} 
                          className="mt-0.5 shrink-0" 
                        />
                        <span>Wäsche-Spar-Option: Ich bringe eigene Bettwäsche und Handtücher mit und spare 20 EUR pro Person.</span>
                      </label>
                    )}

                    <label className="flex items-start gap-3 mt-4 text-[11px] text-text-secondary cursor-pointer leading-tight">
                      <input 
                        type="checkbox" 
                        name="emailCopy" 
                        checked={formData.emailCopy} 
                        onChange={handleInputChange} 
                        className="mt-0.5 shrink-0" 
                      />
                      <span>Ich möchte eine Kopie dieser Anfrage per E-Mail erhalten.</span>
                    </label>

                    {listing.type === 'rental' && (
                      <label className="flex items-start gap-3 mt-4 text-[11px] text-text-secondary cursor-pointer leading-tight">
                        <input required type="checkbox" name="agbAccepted" checked={formData.agbAccepted} onChange={handleInputChange} className="mt-0.5 shrink-0" />
                        <span>
                          Ich akzeptiere die{' '}
                          <Link to="/agb" target="_blank" className="underline text-black font-semibold hover:opacity-85">
                            Allgemeinen Geschäftsbedingungen (AGB)
                          </Link>{' '}
                          .* (Pflichtfeld)
                        </span>
                      </label>
                    )}

                    <label className="flex items-start gap-3 mt-3 text-[11px] text-text-secondary cursor-pointer leading-tight">
                      <input required type="checkbox" name="privacyAccepted" checked={formData.privacyAccepted} onChange={handleInputChange} className="mt-0.5 shrink-0" />
                      <span>
                        Ich habe die{' '}
                        <Link to="/datenschutz" target="_blank" className="underline text-black font-semibold hover:opacity-85">
                          Datenschutzerklärung
                        </Link>{' '}
                        zur Kenntnis genommen und akzeptiere diese.* (Pflichtfeld)
                      </span>
                    </label>
                  </div>

                  <button 
                    type="submit"
                    disabled={!formData.privacyAccepted || (listing.type === 'rental' && !formData.agbAccepted) || reserving || !!error}
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
                        : 'Anfrage absenden'
                    )}
                  </button>
                  {error && (
                    <p className="text-red-500 text-xs text-center mt-2 mb-4">{error}</p>
                  )}
                </form>

                {listing.type === 'sale' && (
                  <a 
                    href={`https://wa.me/4915565224488?text=${encodeURIComponent(`Hallo, ich interessiere mich für das Objekt: ${listing.title} in ${listing.location}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-black text-black py-3 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} className="text-[#25D366]" />
                    WhatsApp Anfrage
                  </a>
                )}
                
                {listing.type === 'rental' && (
                  <p className="text-center text-sm text-text-secondary mb-4">Dir wird noch nichts berechnet</p>
                )}
                
                {listing.type === 'rental' && selectedRange && booking && (
                  <div className="space-y-3 pt-4 animate-in fade-in slide-in-from-top-2 duration-500 border-t border-border-light">
                    {!isMinStayMet && (
                      <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2 mb-4">
                        <Shield size={14} />
                        <span>Mindestaufenthalt: {minNightsRequired} Nächte erforderlich.</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>Ø {formatPrice(subtotal / nights)} x {nights} Nächte</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>Endreinigung</span>
                      <span>{formatPrice(cleaningFee)}</span>
                    </div>
                    {linenFee > 0 && (
                      <div className="flex items-center justify-between text-text-secondary">
                        <span>Wäscheset</span>
                        <span>{formatPrice(linenFee)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>Kurtaxe</span>
                      <span>{formatPrice(kurtaxe)}</span>
                    </div>
                    {serviceFee > 0 && (
                      <div className="flex items-center justify-between text-text-secondary">
                        <span>Servicegebühr</span>
                        <span>{formatPrice(serviceFee)}</span>
                      </div>
                    )}
                    <div className="pt-4 border-t border-border-light flex items-center justify-between font-bold text-lg">
                      <span>Gesamt</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <p className="text-[10px] text-text-secondary italic mt-3 leading-snug">
                      Unverbindliche Preisvorschau. Der finale Mietpreis wird erst mit der schriftlichen Buchungsbestätigung verbindlich berechnet.
                    </p>
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
