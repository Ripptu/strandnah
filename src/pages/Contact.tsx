import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [focused, setFocused] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'rental',
    message: '',
    emailCopy: false,
    privacyAccepted: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, type, value } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [id]: val }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      setError('Bitte geben Sie eine Telefonnummer an.');
      return;
    }
    if (!formData.privacyAccepted) {
      setError('Bitte akzeptieren Sie die Datenschutzerklärung.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'contact_requests'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Hoppla, ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.');
    } finally {
      setSubmitting(false);
    }
  };

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

          <div className="bg-white p-8 md:p-10 rounded-3xl border border-border-main shadow-2xl relative min-h-[500px] flex flex-col justify-center">
            {submitted ? (
              <div className="text-center py-12 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                  <CheckCircle size={36} />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-text-primary">Anfrage gesendet</h2>
                <p className="text-text-secondary leading-relaxed max-w-sm mx-auto">
                  Vielen Dank für Ihre Anfrage! Wir haben Ihre Daten erhalten und melden uns in Kürze bei Ihnen.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-8">Schreiben Sie uns</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onFocus={() => setFocused('firstName')}
                        onBlur={(e) => !e.target.value && setFocused(null)}
                        className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                      <label 
                        htmlFor="firstName"
                        className={`absolute left-4 transition-all pointer-events-none ${focused === 'firstName' || formData.firstName ? 'top-2 text-[10px] uppercase font-bold text-gray-500' : 'top-4 text-text-secondary'}`}
                      >
                        Vorname
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onFocus={() => setFocused('lastName')}
                        onBlur={(e) => !e.target.value && setFocused(null)}
                        className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                      <label 
                        htmlFor="lastName"
                        className={`absolute left-4 transition-all pointer-events-none ${focused === 'lastName' || formData.lastName ? 'top-2 text-[10px] uppercase font-bold text-gray-500' : 'top-4 text-text-secondary'}`}
                      >
                        Nachname
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocused('email')}
                      onBlur={(e) => !e.target.value && setFocused(null)}
                      className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                    <label 
                      htmlFor="email"
                      className={`absolute left-4 transition-all pointer-events-none ${focused === 'email' || formData.email ? 'top-2 text-[10px] uppercase font-bold text-gray-500' : 'top-4 text-text-secondary'}`}
                    >
                      E-Mail Adresse
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => setFocused('phone')}
                      onBlur={(e) => !e.target.value && setFocused(null)}
                      className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                    <label 
                      htmlFor="phone"
                      className={`absolute left-4 transition-all pointer-events-none ${focused === 'phone' || formData.phone ? 'top-2 text-[10px] uppercase font-bold text-gray-500' : 'top-4 text-text-secondary'}`}
                    >
                      Telefon / WhatsApp-Nummer *
                    </label>
                  </div>

                  <div className="relative">
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all appearance-none"
                    >
                      <option value="rental">Buchungsanfrage</option>
                      <option value="sale_self">Kaufinteresse (zur Eigennutzung)</option>
                      <option value="sale_investment">Kaufinteresse (als Kapitalanlage)</option>
                      <option value="general">Allgemeine Anfrage</option>
                    </select>
                    <label 
                      htmlFor="subject"
                      className="absolute left-4 top-2 text-[10px] uppercase font-bold text-text-secondary"
                    >
                      Ich interessiere mich für:
                    </label>
                  </div>

                  <div className="relative">
                    <textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => setFocused('message')}
                      onBlur={(e) => !e.target.value && setFocused(null)}
                      className="w-full pt-6 pb-2 px-4 rounded-lg border border-border-main focus:border-black focus:ring-1 focus:ring-black outline-none transition-all min-h-[150px]"
                    ></textarea>
                    <label 
                      htmlFor="message"
                      className={`absolute left-4 transition-all pointer-events-none ${focused === 'message' || formData.message ? 'top-2 text-[10px] uppercase font-bold text-gray-500' : 'top-4 text-text-secondary'}`}
                    >
                      Ihre Nachricht
                    </label>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 text-[11px] text-text-secondary cursor-pointer leading-tight">
                      <input 
                        type="checkbox" 
                        id="emailCopy"
                        checked={formData.emailCopy}
                        onChange={(e) => handleCheckboxChange('emailCopy', e.target.checked)}
                        className="mt-0.5 shrink-0" 
                      />
                      <span>Ich möchte eine Kopie dieser Anfrage per E-Mail erhalten.</span>
                    </label>

                    <label className="flex items-start gap-3 text-[11px] text-text-secondary cursor-pointer leading-tight">
                      <input 
                        type="checkbox" 
                        id="privacyAccepted"
                        required
                        checked={formData.privacyAccepted}
                        onChange={(e) => handleCheckboxChange('privacyAccepted', e.target.checked)}
                        className="mt-0.5 shrink-0" 
                      />
                      <span>
                        Ich habe die {' '}
                        <Link to="/datenschutz" target="_blank" className="underline text-black font-semibold hover:opacity-85">
                          Datenschutzerklärung
                        </Link>{' '}
                        zur Kenntnis genommen und akzeptiere diese.* (Pflichtfeld)
                      </span>
                    </label>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm font-semibold">{error}</p>
                  )}

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-airbnb-red text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-airbnb-red/20 disabled:bg-gray-300"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Wird verarbeitet...
                      </>
                    ) : (
                      <>
                        Nachricht absenden
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
