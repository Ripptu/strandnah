import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-4xl font-bold mb-8 tracking-tight">Nehmen Sie Kontakt auf</h1>
            <p className="text-text-secondary text-lg mb-12">
              Haben Sie Fragen zu unseren Ferienwohnungen oder interessieren Sie sich für eine Eigentumswohnung? 
              Schreiben Sie uns – wir antworten in der Regel innerhalb weniger Stunden.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">E-Mail</h3>
                  <p className="text-text-secondary">info@strandnah-usedom.de</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Telefon</h3>
                  <p className="text-text-secondary">+49 (0) 38378 12345</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Büro</h3>
                  <p className="text-text-secondary truncate">Lindenstraße 82, 17419 Seebad Ahlbeck</p>
                </div>
              </div>
            </div>

            <div className="mt-16 p-8 bg-airbnb-red/5 rounded-3xl border border-airbnb-red/10">
              <h3 className="font-bold text-xl mb-4">Besichtigungen</h3>
              <p className="text-text-secondary leading-relaxed">
                Wir führen Besichtigungen von Verkaufs-Objekten flexibel und auch am Wochenende durch. Bitte vereinbaren Sie vorab einen Termin.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl border border-border-main shadow-2xl">
            <h2 className="text-2xl font-bold mb-8">Schreiben Sie uns</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    onFocus={() => setFocused('firstName')}
                    onBlur={(e) => !e.target.value && setFocused(null)}
                    className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                  <label 
                    htmlFor="firstName"
                    className={`absolute left-4 transition-all pointer-events-none ${focused === 'firstName' ? 'top-2 text-[10px] uppercase font-bold' : 'top-4 text-text-secondary'}`}
                  >
                    Vorname
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    onFocus={() => setFocused('lastName')}
                    onBlur={(e) => !e.target.value && setFocused(null)}
                    className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                  <label 
                    htmlFor="lastName"
                    className={`absolute left-4 transition-all pointer-events-none ${focused === 'lastName' ? 'top-2 text-[10px] uppercase font-bold' : 'top-4 text-text-secondary'}`}
                  >
                    Nachname
                  </label>
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  onFocus={() => setFocused('email')}
                  onBlur={(e) => !e.target.value && setFocused(null)}
                  className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
                <label 
                  htmlFor="email"
                  className={`absolute left-4 transition-all pointer-events-none ${focused === 'email' ? 'top-2 text-[10px] uppercase font-bold' : 'top-4 text-text-secondary'}`}
                >
                  E-Mail Adresse
                </label>
              </div>

              <div className="relative">
                <select
                  id="subject"
                  className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all appearance-none"
                >
                  <option value="rental">Buchungsanfrage</option>
                  <option value="sale">Interesse am Kauf</option>
                  <option value="general">Allgemeine Anfrage</option>
                </select>
                <label 
                  htmlFor="subject"
                  className="absolute left-4 top-2 text-[10px] uppercase font-bold text-text-secondary"
                >
                  Anliegen
                </label>
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  onFocus={() => setFocused('message')}
                  onBlur={(e) => !e.target.value && setFocused(null)}
                  className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all min-h-[150px]"
                ></textarea>
                <label 
                  htmlFor="message"
                  className={`absolute left-4 transition-all pointer-events-none ${focused === 'message' ? 'top-2 text-[10px] uppercase font-bold' : 'top-4 text-text-secondary'}`}
                >
                  Ihre Nachricht
                </label>
              </div>

              <button 
                type="submit"
                className="w-full bg-airbnb-red text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-airbnb-red/20"
              >
                Nachricht absenden
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
