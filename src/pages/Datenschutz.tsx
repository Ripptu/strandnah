import React from 'react';
import Navbar from '../components/Navbar';

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="inline-block bg-[#1e293b] px-4 py-1 mb-6">
          <span className="text-[#c5a044] font-serif italic text-sm tracking-widest uppercase">Rechtliches</span>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-12 text-[#1e293b]">Datenschutzerklärung</h1>
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. Wir behandeln Ihre Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften.</p>
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#1e293b]">Allgemeine Hinweise</h2>
            <p>Diese Datenschutzerklärung gibt Aufschluss darüber, wie wir Daten erheben und zu welchem Zweck dies geschieht.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#1e293b]">Verantwortliche Stelle</h2>
            <p className="font-medium">alp Verwaltungs GmbH</p>
            <p>Brandenburgische Straße 43</p>
            <p>10707 Berlin</p>
          </section>
        </div>
      </div>
    </div>
  );
}
