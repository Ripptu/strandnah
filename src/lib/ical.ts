import ical from 'node-ical';

export async function getBlockedDatesFromIcal(url: string): Promise<Date[]> {
  try {
    // In a real browser environment, you might hit CORS issues with direct fetch
    // Usually, you'd proxy this through your own backend
    const response = await fetch(url);
    const data = await response.text();
    const events = ical.parseICS(data);
    
    const blockedDates: Date[] = [];
    
    for (const k in events) {
      if (Object.prototype.hasOwnProperty.call(events, k)) {
        const event = events[k];
        if (event.type === 'VEVENT') {
          const start = new Date(event.start as Date);
          const end = new Date(event.end as Date);
          
          // Add all dates between start and end
          let current = new Date(start);
          while (current <= end) {
            blockedDates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        }
      }
    }
    
    return blockedDates;
  } catch (error) {
    console.error('Error fetching/parsing iCal:', error);
    return [];
  }
}
