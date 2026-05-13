
export interface SeasonPeriod {
  start: { month: number; day: number };
  end: { month: number; day: number };
  minNights: number;
}

export interface SeasonConfig {
  name: string;
  basePrice: number;
  weekendPrice: number;
  periods: SeasonPeriod[];
}

export const SEASONS: SeasonConfig[] = [
  {
    name: 'Hauptsaison',
    basePrice: 120,
    weekendPrice: 140,
    periods: [
      { start: { month: 5, day: 26 }, end: { month: 8, day: 15 }, minNights: 5 }, // 26.06 - 15.09
      { start: { month: 11, day: 24 }, end: { month: 0, day: 6 }, minNights: 5 }, // 24.12 - 06.01
    ]
  },
  {
    name: 'Nebensaison',
    basePrice: 70,
    weekendPrice: 100,
    periods: [
      { start: { month: 0, day: 7 }, end: { month: 5, day: 25 }, minNights: 3 }, // 07.01 - 25.06
      { start: { month: 8, day: 16 }, end: { month: 11, day: 23 }, minNights: 3 }, // 16.09 - 23.12
    ]
  }
];

export function getPriceForDate(date: Date): number {
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday

  let seasonMatch = SEASONS.find(s => s.name === 'Nebensaison'); // fallback null coalescing doesn't work array-like easily

  for (const season of SEASONS) {
    for (const period of season.periods) {
      const startVal = period.start.month * 100 + period.start.day;
      const endVal = period.end.month * 100 + period.end.day;
      const currentVal = month * 100 + day;

      if (startVal <= endVal) {
        if (currentVal >= startVal && currentVal <= endVal) {
          seasonMatch = season;
        }
      } else {
        // Overlaps year end
        if (currentVal >= startVal || currentVal <= endVal) {
          seasonMatch = season;
        }
      }
    }
  }
  
  if (!seasonMatch) seasonMatch = SEASONS[1]; // fallback Nebensaison
  
  // Weekend is Friday and Saturday night (checkout Saturday/Sunday)
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return seasonMatch.weekendPrice;
  }
  return seasonMatch.basePrice;
}

export function calculateBookingDetails(start: Date, end: Date, guests: number = 1) {
  let totalBasePrice = 0;
  const nights: { date: Date, price: number }[] = [];
  
  const startObj = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endObj = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  let current = new Date(startObj);
  while (current < endObj) {
    const price = getPriceForDate(current);
    nights.push({ date: new Date(current), price });
    totalBasePrice += price;
    current.setDate(current.getDate() + 1);
  }

  const numNights = nights.length;
  const cleaningFee = 70;
  // Kurtaxe: 3,70 € je Person und Übernachtung (An- und Abfahrt zählen wir als Bestandteil der Nächte)
  const kurtaxe = 3.70 * guests * numNights;
  const linenFee = 20 * guests;
  
  const totalBaseWithTax = totalBasePrice + cleaningFee + kurtaxe + linenFee;
  const serviceFee = 0; // Keine Servicegebühr
  const total = totalBaseWithTax + serviceFee;

  return {
    numNights,
    totalBasePrice,
    cleaningFee,
    kurtaxe,
    linenFee,
    serviceFee,
    total,
    nights
  };
}
