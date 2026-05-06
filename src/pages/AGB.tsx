import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AGB() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="inline-block bg-[#1e293b] px-4 py-1 mb-6">
          <span className="text-[#c5a044] font-serif italic text-sm tracking-widest uppercase">Rechtliches</span>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-12 text-[#1e293b]">Allgemeine Geschäftsbedingungen</h1>
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#1e293b]">§ 1 Geltungsbereich</h2>
            <p>Diese Geschäftsbedingungen gelten für alle Verträge über die Vermietung von Ferienwohnungen und Ferienhäusern sowie alle für den Kunden erbrachten weiteren Leistungen und Lieferungen des Anbieters.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#1e293b]">§ 2 Vertragsabschluss</h2>
            <p>Der Vertrag kommt durch die schriftliche Bestätigung der Reservierung durch den Anbieter zustande.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
