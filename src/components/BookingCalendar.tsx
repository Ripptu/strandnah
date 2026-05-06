import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getBlockedDatesFromIcal } from '@/src/lib/ical';

interface Props {
  icalUrl?: string;
}

export default function BookingCalendar({ icalUrl }: Props) {
  const [value, onChange] = useState<any>(new Date());
  const [bookedDays, setBookedDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (icalUrl) {
      setLoading(true);
      // In a real app, you would fetch this from your backend to avoid CORS
      // For demo purposes, we'll use a mocked fetch if it fails
      getBlockedDatesFromIcal(icalUrl)
        .then(dates => {
          setBookedDays(dates);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      // Dummy logic if no URL provided
      setBookedDays([
        new Date(2026, 4, 10),
        new Date(2026, 4, 11),
        new Date(2026, 4, 12),
        new Date(2026, 4, 20),
        new Date(2026, 4, 21),
      ]);
    }
  }, [icalUrl]);

  const tileClassName = ({ date, view }: any) => {
    if (view === 'month') {
      if (bookedDays.find(d => d.toDateString() === date.toDateString())) {
        return 'booked';
      }
    }
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
      <h3 className="text-xl font-bold mb-6">Verfügbarkeit prüfen</h3>
      <div className="calendar-container">
        <Calendar 
          onChange={onChange} 
          value={value} 
          selectRange={true}
          tileClassName={tileClassName}
        />
      </div>
      <div className="mt-8 flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-airbnb-red rounded-full"></div>
          <span>Ausgewählt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded-full border border-gray-300"></div>
          <span>Verfügbar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <span>Belegt</span>
        </div>
      </div>
    </div>
  );
}
