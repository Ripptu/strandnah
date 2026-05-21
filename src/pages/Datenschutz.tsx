import React from 'react';
import Navbar from '../components/Navbar';

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-4">Rechtliches</p>
        <h1 className="text-4xl font-bold tracking-tight mb-12 text-black">Datenschutzerklärung</h1>
        <div className="space-y-8 text-text-secondary leading-relaxed">
          <p>Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. Wir behandeln Ihre Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften.</p>
          <section>
            <h2 className="text-xl font-bold mb-4 text-black border-b border-gray-100 pb-2">Allgemeine Hinweise</h2>
            <p>Diese Datenschutzerklärung gibt Aufschluss darüber, wie wir Daten erheben und zu welchem Zweck dies geschieht.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4 text-black border-b border-gray-100 pb-2">Verantwortliche Stelle</h2>
            <p className="font-medium">alp Verwaltungs GmbH</p>
            <p>Brandenburgische Straße 43</p>
            <p>10707 Berlin</p>
          </section>
        </div>
      </div>
    </div>
  );
}
