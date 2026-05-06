import React from 'react';
import { SEASONS } from '@/src/lib/pricing';

export default function PricingTable() {
  // Sort seasons to match the expected display order: Hauptsaison, Nebensaison
  const displayOrder = ['Hauptsaison', 'Nebensaison'];
  const sortedSeasons = [...SEASONS].sort((a, b) => 
    displayOrder.indexOf(a.name) - displayOrder.indexOf(b.name)
  );

  return (
    <div className="py-12 border-t border-border-light">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold">Preise & Saisonzeiten</h3>
        <p className="text-xs text-text-secondary italic">Preisangaben pro Nacht</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {sortedSeasons.map((season, sIdx) => (
          <div key={sIdx} className="bg-white border border-black/5 rounded-lg overflow-hidden shadow-xl flex flex-col transition-transform hover:translate-y-[-4px] duration-300">
            <div className="bg-[#1e293b] py-4 text-center">
              <span className="text-[#c5a044] font-serif italic text-2xl tracking-wide">{season.name}</span>
            </div>
            <div className="bg-[#f1f5f9] py-12 text-center border-b border-gray-100">
              <div className="flex items-baseline justify-center">
                <span className="text-7xl font-serif font-bold text-[#1e293b] tracking-tighter">
                  {season.name === 'Hauptsaison' ? '120' : '70 - 100'}
                </span>
                <span className="text-3xl text-gray-400 font-light ml-2">EUR</span>
              </div>
            </div>
            <div className="flex-1 p-8 flex flex-col items-center justify-between bg-white">
              <div className="space-y-6 w-full text-center">
                {season.periods.map((period, pIdx) => (
                  <div key={pIdx}>
                    <p className="text-sm font-medium text-gray-800">
                      {period.start.day.toString().padStart(2, '0')}.{(period.start.month + 1).toString().padStart(2, '0')}. - {period.end.day.toString().padStart(2, '0')}.{(period.end.month + 1).toString().padStart(2, '0')}.
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-gray-50 w-full text-center">
                <p className="text-sm font-bold text-[#1e293b]">
                  ab {season.periods[0].minNights} Übernachtungen
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
