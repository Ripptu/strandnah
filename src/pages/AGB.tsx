import React from 'react';
import Navbar from '../components/Navbar';

export default function AGB() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-4">Rechtliches</p>
        <h1 className="text-4xl font-bold tracking-tight mb-12 text-black">Allgemeine Geschäftsbedingungen</h1>
        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-4 text-black border-b border-gray-100 pb-2">§ 1 Geltungsbereich</h2>
            <p>Diese Geschäftsbedingungen gelten für alle Verträge über die Vermietung von Ferienwohnungen und Ferienhäusern sowie alle für den Kunden erbrachten weiteren Leistungen und Lieferungen des Anbieters.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4 text-black border-b border-gray-100 pb-2">§ 2 Vertragsabschluss</h2>
            <p>Der Vertrag kommt durch die schriftliche Bestätigung der Reservierung durch den Anbieter zustande.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
