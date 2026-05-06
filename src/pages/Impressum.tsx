export default function Impressum() {
  return (
    <div className="pt-32 pb-20 max-w-3xl mx-auto px-6">
      <div className="inline-block bg-[#1e293b] px-4 py-1 mb-6">
        <span className="text-[#c5a044] font-serif italic text-sm tracking-widest uppercase">Rechtliches</span>
      </div>
      <h1 className="text-4xl font-serif font-bold mb-12 text-[#1e293b]">Impressum</h1>
      
      <div className="space-y-12 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-4 text-[#1e293b] border-b border-gray-100 pb-2">Angaben gemäß § 5 TMG</h2>
          <p className="text-lg font-medium mb-1">alp Verwaltungs GmbH</p>
          <p>Brandenburgische Straße 43</p>
          <p>10707 Berlin</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-[#1e293b] border-b border-gray-100 pb-2">Vertreten durch</h2>
          <p>Achim Laschewsky (Geschäftsführer)</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-[#1e293b] border-b border-gray-100 pb-2">Registereintrag</h2>
          <p>Sitz der Gesellschaft: Berlin</p>
          <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
          <p>Registernummer: HRB 272371</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-[#1e293b] border-b border-gray-100 pb-2">Kontakt</h2>
          <p>E-Mail: info@strandnah-usedom.de</p>
        </section>

        <section className="pt-8 border-t border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-[#1e293b]">Haftungsausschluss</h2>
          <p className="mb-4">
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
        </section>
      </div>
    </div>
  );
}
