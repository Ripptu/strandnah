import { MapPin, Sun, Waves, Bike } from 'lucide-react';

export default function Location() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-4 tracking-tight">Die Lage: Usedom erleben</h1>
          <p className="text-text-secondary text-lg">Ein Paradies zwischen Ostsee und Achterwasser.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-2xl font-bold mb-6">Willkommen auf der Sonneninsel</h2>
            <p className="text-text-primary leading-relaxed mb-6">
              Usedom ist mit durchschnittlich 1.900 Sonnenstunden im Jahr die sonnenreichste Region Deutschlands. 
              Hier verbindet sich maritime Gelassenheit mit exzellenter Infrastruktur. Unsere Objekte befinden sich in 
              den begehrtesten Lagen der „Drei Kaiserbäder“ Bansin, Heringsdorf und Ahlbeck sowie im malerischen Zinnowitz.
            </p>
            
            <div className="space-y-6 mt-10">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                <Waves size={24} className="text-airbnb-red mt-1" />
                <div>
                  <h3 className="font-bold">Direkte Strandnähe</h3>
                  <p className="text-sm text-text-secondary">Alle unsere Unterkünfte sind maximal 10 Gehminuten vom feinsandigen Ostseestrand entfernt.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                <Bike size={24} className="text-airbnb-red mt-1" />
                <div>
                  <h3 className="font-bold">Bestes Radwegenetz</h3>
                  <p className="text-sm text-text-secondary">Erkunden Sie die Insel auf hunderten Kilometern ausgebauter Radwege direkt ab der Haustür.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                <Sun size={24} className="text-airbnb-red mt-1" />
                <div>
                  <h3 className="font-bold">Natur pur</h3>
                  <p className="text-sm text-text-secondary">Das Hinterland mit seinen Seen und Wäldern bietet Ruhe und Erholung abseits des Trubels.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl overflow-hidden h-[450px] shadow-xl border border-border-light relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d152174.453303799!2d13.916962450000002!3d53.9458213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2sde!4v1714995000000!5m2!1sde!2sde" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <MapPin size={16} className="text-airbnb-red" />
              <span className="text-sm font-bold">Insel Usedom</span>
            </div>
          </div>
        </div>

        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-10">Umgebung & Aktivitäten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col h-full">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                <Sun className="text-airbnb-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">OstseeTherme Usedom</h3>
              <p className="text-text-secondary mb-6 flex-grow">Entspannung pur bei jedem Wetter direkt im Seebad Heringsdorf mit herrlicher Thermal-Sole.</p>
              <a href="https://www.ostseetherme-usedom.de" target="_blank" rel="noopener noreferrer" className="text-airbnb-red font-bold flex items-center gap-2 hover:underline">
                Website besuchen <Waves size={16} />
              </a>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col h-full">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                <MapPin className="text-airbnb-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">Seebrücke Ahlbeck</h3>
              <p className="text-text-secondary mb-6 flex-grow">Die älteste Seebrücke Deutschlands und das Wahrzeichen der Insel – nur wenige Minuten entfernt.</p>
              <a href="https://www.kaiserbaeder-auf-usedom.de/seebruecke-ahlbeck/" target="_blank" rel="noopener noreferrer" className="text-airbnb-red font-bold flex items-center gap-2 hover:underline">
                Mehr erfahren <Waves size={16} />
              </a>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col h-full">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                <Bike className="text-airbnb-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">Naturpark Usedom</h3>
              <p className="text-text-secondary mb-6 flex-grow">Entdecken Sie das „Achterland“ mit seinen Seen, Mooren und malerischen Dörfern mit dem Rad.</p>
              <a href="https://www.naturpark-usedom.de" target="_blank" rel="noopener noreferrer" className="text-airbnb-red font-bold flex items-center gap-2 hover:underline">
                Website besuchen <Waves size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-black text-white rounded-3xl p-12 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-airbnb-red rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-3xl"></div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Wann kommen Sie uns besuchen?</h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">
            Lassen Sie sich von der Magie Usedoms verzaubern. Gerne zeigen wir Ihnen unsere Objekte auch vor Ort.
          </p>
          <button className="bg-white text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors relative z-10 transition-transform active:scale-95">
            Termin vereinbaren
          </button>
        </section>
      </div>
    </div>
  );
}
