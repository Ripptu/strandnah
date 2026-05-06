export default function Impressum() {
  return (
    <div className="pt-32 pb-20 max-w-3xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-8">Impressum</h1>
      <div className="prose prose-airbnb max-w-none text-text-primary space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-2">Angaben gemäß § 5 TMG</h2>
          <p>
            Strandnah Usedom GmbH<br />
            Friedrichstraße 12<br />
            17419 Seebad Ahlbeck
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Kontakt</h2>
          <p>
            Telefon: +49 (0) 38378 12345<br />
            E-Mail: info@strandnah-usedom.de
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            DE 123 456 789
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
            <a href="https://ec.europa.eu/consumers/odr/" className="underline ml-1">https://ec.europa.eu/consumers/odr/</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
