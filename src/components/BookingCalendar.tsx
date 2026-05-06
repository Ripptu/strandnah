import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getBlockedDatesFromIcal } from '@/src/lib/ical';
import { db } from '@/src/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface Props {
  listingId?: string;
  icalUrl?: string;
  onDateChange: (range: [Date, Date] | null) => void;
}

export default function BookingCalendar({ listingId, icalUrl, onDateChange }: Props) {
  const [selectedRange, setSelectedRange] = useState<any>(null);
  const [dbBookedDays, setDbBookedDays] = useState<Date[]>([]);
  const [icalBookedDays, setIcalBookedDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  // Firestore Bookings Listener
  useEffect(() => {
    if (!listingId) return;

    // We fetch all bookings for this listing and filter cancelled ones in memory
    // to avoid the need for composite indexes in the demo environment.
    const q = query(
      collection(db, 'bookings'),
      where('listingId', '==', listingId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dates: Date[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'cancelled') return;
        
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        
        // Add all dates between start and end
        let curr = new Date(start);
        // Normalize to midnight to avoid timezone shifts during the loop
        curr.setHours(0, 0, 0, 0);
        const endNormal = new Date(end);
        endNormal.setHours(0, 0, 0, 0);

        while (curr <= endNormal) {
          dates.push(new Date(curr));
          curr.setDate(curr.getDate() + 1);
        }
      });
      setDbBookedDays(dates);
    }, (error) => {
      console.error("Firestore subscription error:", error);
    });

    return () => unsubscribe();
  }, [listingId]);

  // iCal Listener
  useEffect(() => {
    if (icalUrl) {
      setLoading(true);
      getBlockedDatesFromIcal(icalUrl)
        .then(dates => {
          setIcalBookedDays(dates.map(d => new Date(d)));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [icalUrl]);

  const bookedDays = [...dbBookedDays, ...icalBookedDays];

  const handleDateChange = (value: any) => {
    setSelectedRange(value);
    onDateChange(value);
  };

  const tileDisabled = ({ date, view }: any) => {
    if (view === 'month') {
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      const booked = bookedDays.find(d => d.toDateString() === date.toDateString());
      return isPast || !!booked;
    }
    return false;
  };

  const tileClassName = ({ date, view }: any) => {
    if (view === 'month') {
      if (bookedDays.find(d => d.toDateString() === date.toDateString())) {
        return 'booked text-gray-300 line-through';
      }
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-border-light p-6 shadow-sm relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Synchronisiere...</span>
          </div>
        </div>
      )}
      <h3 className="text-xl font-bold mb-6">Zeitraum auswählen</h3>
      <div className="calendar-container">
        <Calendar 
          onChange={handleDateChange} 
          value={selectedRange} 
          selectRange={true}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          minDate={new Date()}
          className="w-full border-none font-sans"
        />
      </div>
      <div className="mt-8 flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <span>Gewählt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-100 rounded-full border border-gray-200"></div>
          <span>Frei</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-full h-[1px] bg-gray-400 rotate-45"></div>
          </div>
          <span>Belegt</span>
        </div>
      </div>
    </div>
  );
}
