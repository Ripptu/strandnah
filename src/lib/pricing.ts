
export interface SeasonPeriod {
  start: { month: number; day: number };
  end: { month: number; day: number };
  minNights: number;
}

export interface SeasonConfig {
  name: string;
  price: number;
  periods: SeasonPeriod[];
}

export const SEASONS: SeasonConfig[] = [
  {
    name: 'Hauptsaison',
    price: 120,
    periods: [
      { start: { month: 5, day: 26 }, end: { month: 8, day: 15 }, minNights: 5 }, // 26.06 - 15.09
      { start: { month: 11, day: 24 }, end: { month: 0, day: 6 }, minNights: 5 }, // 24.12 - 06.01
    ]
  },
  {
    name: 'Nebensaison',
    price: 85, // Mittelwert aus 70-100 EUR
    periods: [
      { start: { month: 0, day: 7 }, end: { month: 5, day: 25 }, minNights: 3 }, // 07.01 - 25.06
      { start: { month: 8, day: 16 }, end: { month: 11, day: 23 }, minNights: 3 }, // 16.09 - 23.12
    ]
  }
];

export function getPriceForDate(date: Date): number {
  const month = date.getMonth();
  const day = date.getDate();

  for (const season of SEASONS) {
    for (const period of season.periods) {
      const startVal = period.start.month * 100 + period.start.day;
      const endVal = period.end.month * 100 + period.end.day;
      const currentVal = month * 100 + day;

      if (startVal <= endVal) {
        if (currentVal >= startVal && currentVal <= endVal) return season.price;
      } else {
        // Overlaps year end
        if (currentVal >= startVal || currentVal <= endVal) return season.price;
      }
    }
  }
  
  return 85; // Fallback auf Nebensaison
}

export function calculateBookingDetails(start: Date, end: Date) {
  let totalBasePrice = 0;
  const nights: { date: Date, price: number }[] = [];
  
  let current = new Date(start);
  while (current < end) {
    const price = getPriceForDate(current);
    nights.push({ date: new Date(current), price });
    totalBasePrice += price;
    current.setDate(current.getDate() + 1);
  }

  const numNights = nights.length;
  const cleaningFee = 85;
  const serviceFee = Math.round(totalBasePrice * 0.12);
  const total = totalBasePrice + cleaningFee + serviceFee;

  return {
    numNights,
    totalBasePrice,
    cleaningFee,
    serviceFee,
    total,
    nights
  };
}
