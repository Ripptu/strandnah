import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, writeBatch, onSnapshot } from 'firebase/firestore';
import { Listing, RENTALS, SALES } from '@/src/constants';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, RefreshCcw, Database } from 'lucide-react';

export default function AdminDashboard() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Listing & { amenities: string[] }>>({
    title: '',
    location: '',
    price: '',
    description: '',
    type: 'rental',
    images: [],
    features: [],
    amenities: []
  });

  const [newImage, setNewImage] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  const fetchListings = async () => {
    // onSnapshot handles this automatically, but we keep this for the refresh button
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'listings'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Snapshot error:", error);
        setErrorStatus("Fehler beim Laden der Echtzeit-Daten.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSeedData = async () => {
    setSubmitting(true);
    setErrorStatus(null);
    try {
      const batch = writeBatch(db);
      const allStatic = [...RENTALS, ...SALES];
      
      allStatic.forEach(item => {
        const docRef = doc(collection(db, 'listings'));
        batch.set(docRef, {
          ...item,
          secret: 'vamela',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error("Seed error:", error);
      setErrorStatus("Fehler beim Laden der Standard-Daten.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = editingId ? `listings/${editingId}` : 'listings';
    setSubmitting(true);
    setErrorStatus(null);
    try {
      const cleanData = { ...formData };
      delete (cleanData as any).id;

      const dataToSave = {
        ...cleanData,
        secret: 'vamela',
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'listings', editingId), dataToSave);
      } else {
        await addDoc(collection(db, 'listings'), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
      }
      
      setEditingId(null);
      setFormData({
        title: '',
        location: '',
        price: '',
        description: '',
        type: 'rental',
        images: [],
        features: [],
        amenities: []
      });
    } catch (error) {
      console.error("Save error:", error);
      setErrorStatus("Fehler beim Speichern.");
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, path);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (listing: any) => {
    setEditingId(listing.id);
    setFormData({
      title: listing.title || '',
      location: listing.location || '',
      price: listing.price || '',
      description: listing.description || '',
      type: listing.type || 'rental',
      images: listing.images || [],
      features: listing.features || [],
      amenities: listing.amenities || [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!id || submitting) return;
    
    // Using a simpler verification since window.confirm might be flaky in some iframes
    setSubmitting(true);
    setErrorStatus(null);
    try {
      console.log("Attempting to delete document:", id);
      await deleteDoc(doc(db, 'listings', id));
      console.log("Delete successful for id:", id);
      // setListings will update automatically via onSnapshot
    } catch (error) {
      console.error("Delete error for id " + id + ":", error);
      setErrorStatus("Löschen fehlgeschlagen.");
      handleFirestoreError(error, OperationType.DELETE, `listings/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const addImage = () => {
    if (newImage && formData.images) {
      setFormData({ ...formData, images: [...formData.images, newImage] });
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    if (formData.images) {
      const updated = [...formData.images];
      updated.splice(index, 1);
      setFormData({ ...formData, images: updated });
    }
  };

  const addFeature = () => {
    if (newFeature && formData.features) {
      setFormData({ ...formData, features: [...formData.features, newFeature] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    if (formData.features) {
      const updated = [...formData.features];
      updated.splice(index, 1);
      setFormData({ ...formData, features: updated });
    }
  };

  const addAmenity = () => {
    if (newAmenity && formData.amenities) {
      setFormData({ ...formData, amenities: [...formData.amenities, newAmenity] });
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    if (formData.amenities) {
      const updated = [...formData.amenities];
      updated.splice(index, 1);
      setFormData({ ...formData, amenities: updated });
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        {errorStatus && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex justify-between items-center">
            <span>{errorStatus}</span>
            <button onClick={() => setErrorStatus(null)}><X size={16} /></button>
          </div>
        )}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-start gap-4">
            <h1 className="text-3xl font-bold">Chef-Konsole</h1>
            <div className="flex gap-2">
              <button 
                onClick={fetchListings} 
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Liste aktualisieren"
              >
                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
              <button 
                onClick={handleSeedData} 
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-blue-600"
                title="Standard-Daten laden"
              >
                <Database size={18} />
              </button>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('admin_token');
              window.location.href = '/admin';
            }}
            className="text-sm font-semibold underline text-airbnb-red"
          >
            Abmelden
          </button>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl border border-border-light p-8 shadow-xl mb-12">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
            {editingId ? 'Objekt bearbeiten' : 'Neues Objekt anlegen'}
          </h2>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Titel</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 rounded-lg border border-border-main" 
                  required 
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Lage (z.B. Heringsdorf)</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-3 rounded-lg border border-border-main" 
                  required 
                  disabled={submitting}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Preis</label>
                  <input 
                    type="text" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="120 € / Nacht"
                    className="w-full p-3 rounded-lg border border-border-main" 
                    required 
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Typ</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full p-3 rounded-lg border border-border-main"
                    disabled={submitting}
                  >
                    <option value="rental">Ferienwohnung</option>
                    <option value="sale">Eigentumswohnung</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Beschreibung</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 rounded-lg border border-border-main min-h-[120px]" 
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Details (z.B. 4 Gäste, 1 Bad) hinzufügen</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="z.B. 4 Gäste"
                    className="flex-grow p-3 rounded-lg border border-border-main" 
                    disabled={submitting}
                  />
                  <button type="button" onClick={addFeature} disabled={submitting} className="bg-black text-white px-4 rounded-lg">Hinzufügen</button>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {formData.features?.map((f, i) => (
                    <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                      {f} <X size={12} className="cursor-pointer" onClick={() => removeFeature(i)} />
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Ausstattungen (Was diese Unterkunft bietet) hinzufügen</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="z.B. WLAN, Kaffeemaschine"
                    className="flex-grow p-3 rounded-lg border border-border-main" 
                    disabled={submitting}
                  />
                  <button type="button" onClick={addAmenity} disabled={submitting} className="bg-black text-white px-4 rounded-lg">Hinzufügen</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities?.map((a, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                      {a} <X size={12} className="cursor-pointer" onClick={() => removeAmenity(i)} />
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Bilder hinzufügen (URLs)</label>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newImage}
                    placeholder="https://unsplash..."
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-grow p-3 rounded-lg border border-border-main" 
                    disabled={submitting}
                  />
                  <button type="button" onClick={addImage} disabled={submitting} className="bg-black text-white px-4 rounded-lg">
                    <ImageIcon size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {formData.images?.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={img} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={submitting}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-airbnb-red text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {submitting ? 'Verarbeite...' : editingId ? 'Speichern' : 'Anlegen'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: '', location: '', price: '', description: '', type: 'rental', images: [], features: [], amenities: [] });
                    }}
                    className="w-full bg-gray-100 py-3 rounded-xl font-bold"
                    disabled={submitting}
                  >
                    Abbrechen
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Vorhandene Objekte ({listings.length})</h2>
          {loading && listings.length === 0 ? (
            <p className="animate-pulse">Lade Objekte...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <div key={l.id} className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm group relative">
                  {submitting && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-airbnb-red"></div>
                    </div>
                  )}
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img src={l.images[0]} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(l)} 
                        disabled={submitting}
                        className="bg-white p-3 rounded-full shadow-lg hover:text-airbnb-red disabled:opacity-50"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(l.id)} 
                        disabled={submitting}
                        className="bg-white p-3 rounded-full shadow-lg hover:text-airbnb-red disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {l.type === 'rental' ? 'Vermietung' : 'Verkauf'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold truncate">{l.title}</h3>
                    <p className="text-sm text-text-secondary">{l.location}</p>
                    <p className="mt-2 font-bold">{l.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
