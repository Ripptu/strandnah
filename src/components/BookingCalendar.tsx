import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function BookingCalendar() {
  const [value, onChange] = useState<any>(new Date());

  // Dummy logic: Mark some days as booked
  const bookedDays = [
    new Date(2026, 4, 10),
    new Date(2026, 4, 11),
    new Date(2026, 4, 12),
    new Date(2026, 4, 20),
    new Date(2026, 4, 21),
  ];

  const tileClassName = ({ date, view }: any) => {
    if (view === 'month') {
      if (bookedDays.find(d => d.toDateString() === date.toDateString())) {
        return 'booked';
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border-light p-6 shadow-sm">
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
