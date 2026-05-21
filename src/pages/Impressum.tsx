export default function Impressum() {
  return (
    <div className="pt-32 pb-20 max-w-3xl mx-auto px-6">
      <p className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-4">Rechtliches</p>
      <h1 className="text-4xl font-bold tracking-tight mb-12 text-black">Impressum</h1>
      
      <div className="space-y-12 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-4 text-black border-b border-gray-100 pb-2">Angaben gemäß § 5 TMG</h2>
          <p className="text-lg font-medium mb-1">alp Verwaltungs GmbH</p>
          <p>Brandenburgische Straße 43</p>
          <p>10707 Berlin</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-black border-b border-gray-100 pb-2">Vertreten durch</h2>
          <p>Achim Laschewsky (Geschäftsführer)</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-black border-b border-gray-100 pb-2">Registereintrag</h2>
          <p>Sitz der Gesellschaft: Berlin</p>
          <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
          <p>Registernummer: HRB 272371</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-black border-b border-gray-100 pb-2">Kontakt</h2>
          <p>E-Mail: info@strandnah-usedom.de</p>
        </section>

        <section className="pt-8 border-t border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-black">Haftungsausschluss</h2>
          <p className="mb-4">
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
        </section>
      </div>
    </div>
  );
}
