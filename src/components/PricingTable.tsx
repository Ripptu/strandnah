import React from 'react';
import { SEASONS } from '@/src/lib/pricing';
import { Info } from 'lucide-react';

export default function PricingTable() {
  // Sort seasons to match the expected display order: Hauptsaison, Nebensaison
  const displayOrder = ['Hauptsaison', 'Nebensaison'];
  const sortedSeasons = [...SEASONS].sort((a, b) => 
    displayOrder.indexOf(a.name) - displayOrder.indexOf(b.name)
  );

  return (
    <div className="py-8 border-b border-border-light text-text-primary">
      <h3 className="text-xl font-bold mb-6">Preise & Saisonzeiten</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {sortedSeasons.map((season, sIdx) => (
          <div key={sIdx} className="border border-border-light rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between hover:border-black transition-colors">
            <div>
              <h4 className="text-lg font-bold mb-4">{season.name}</h4>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-3xl font-bold">
                   {season.basePrice} - {season.weekendPrice} €
                </span>
                <span className="text-text-secondary mb-1">/ Nacht</span>
              </div>
              <div className="space-y-3 mb-6">
                {season.periods.map((period, pIdx) => (
                  <div key={pIdx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                    <span className="text-text-secondary">Zeitraum</span>
                    <span className="font-semibold text-black">
                      {period.start.day.toString().padStart(2, '0')}.{(period.start.month + 1).toString().padStart(2, '0')}. - {period.end.day.toString().padStart(2, '0')}.{(period.end.month + 1).toString().padStart(2, '0')}.
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-xl text-center">
              <span className="text-sm font-semibold">Mindestaufenthalt: {season.periods[0].minNights} Nächte</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="text-airbnb-red pt-1">
          <Info size={24} />
        </div>
        <div className="text-sm text-text-secondary space-y-2">
          <p><strong className="text-black">Zusätzliche Preishinweise:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Die höheren Preise pro Nacht (100 € bzw. 140 €) gelten an den Wochenenden (Freitag & Samstag).</li>
            <li><strong>Endreinigung:</strong> 70 € pauschal pro Aufenthalt</li>
            <li><strong>Wäscheset:</strong> 20 € pro Person</li>
            <li><strong>Kurtaxe:</strong> 3,70 € pro Person und Übernachtung (An- und Abreisetag zählen als 1 Tag)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
