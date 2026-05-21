import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, writeBatch, onSnapshot } from 'firebase/firestore';
import { Listing, RENTALS, SALES, AREA_LABELS } from '@/src/constants';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, RefreshCcw, Database, Upload, ArrowLeft, ArrowRight } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function AdminDashboard() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Listing & { amenities: string[], areaImages: Record<string, string | string[]>, pdfLinks: string[], icalUrl: string, isActive: boolean }>>({
    title: '',
    location: '',
    price: '',
    description: '',
    type: 'rental',
    images: [],
    features: [],
    amenities: [],
    areaImages: {},
    pdfLinks: [],
    icalUrl: '',
    isActive: true
  });

  const [newImage, setNewImage] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newPdfLink, setNewPdfLink] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleCloudinaryUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dvwijhs3c';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Strandnah';

    if (!cloudName || !uploadPreset) {
      setErrorStatus("Cloudinary Upload ist nicht konfiguriert. Bitte setzen Sie VITE_CLOUDINARY_CLOUD_NAME und VITE_CLOUDINARY_UPLOAD_PRESET in der .env-Datei.");
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));
    setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));
    setErrorStatus(null);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        let fileToUpload = files[i];
        
        // Komprimiere Bilder, wenn es sich um ein Bild handelt
        if (fileToUpload.type.startsWith('image/')) {
          try {
            const options = {
              maxSizeMB: 9, // Knapp unter 10MB Grenze von Cloudinary Free
              maxWidthOrHeight: 2560,
              useWebWorker: true,
            };
            fileToUpload = await imageCompression(fileToUpload, options);
          } catch (compressError) {
            console.error('Fehler bei der Bildkomprimierung', compressError);
            // Ignorieren und Original verwenden, falls Fehler auftritt
          }
        }

        const form = new FormData();
        form.append('file', fileToUpload);
        form.append('upload_preset', uploadPreset);

        const secureUrl = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percentage = Math.round((e.loaded / e.total) * 100);
              // Account for multiple files by normalizing the percentage
              const overallPercentage = Math.round(((i * 100) + percentage) / files.length);
              setUploadProgress(prev => ({ ...prev, [fieldName]: overallPercentage }));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const data = JSON.parse(xhr.responseText);
              resolve(data.secure_url);
            } else {
              reject(new Error(`Cloudinary upload failed: ${xhr.responseText}`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error during upload'));
          xhr.send(form);
        });

        if (secureUrl) {
          urls.push(secureUrl);
        }
      }

      setFormData(prev => {
        if (fieldName.startsWith('areaImages.')) {
          const areaKey = fieldName.split('.')[1];
          const existing = prev.areaImages?.[areaKey] || [];
          const existingArray = Array.isArray(existing) ? existing : [existing].filter(Boolean);
          return {
            ...prev,
            areaImages: {
              ...prev.areaImages,
              [areaKey]: [...existingArray, ...urls]
            }
          };
        } else if (fieldName === 'images') {
          return { ...prev, images: [...(prev.images || []), ...urls] };
        } else if (fieldName === 'pdfLinks') {
          return { ...prev, pdfLinks: [...(prev.pdfLinks || []), ...urls] };
        }
        return prev;
      });
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      setErrorStatus(`Fehler beim Hochladen der Datei(en): ${error.message}`);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [fieldName]: false }));
      setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));
      // Reset input
      event.target.value = '';
    }
  };

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
        const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
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
        const { id, ...itemData } = item;
        batch.set(docRef, {
          ...itemData,
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
        amenities: [],
        areaImages: {},
        pdfLinks: [],
        icalUrl: '',
        isActive: true
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
      areaImages: listing.areaImages || {},
      pdfLinks: listing.pdfLinks || [],
      icalUrl: listing.icalUrl || '',
      isActive: listing.isActive !== false,
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

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (formData.images) {
      const updated = [...formData.images];
      if (direction === 'left' && index > 0) {
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      } else if (direction === 'right' && index < updated.length - 1) {
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      }
      setFormData({ ...formData, images: updated });
    }
  };

  const removeAreaImage = (areaKey: string, index: number) => {
    if (formData.areaImages && formData.areaImages[areaKey]) {
      const areaImagesArray = Array.isArray(formData.areaImages[areaKey]) ? formData.areaImages[areaKey] as string[] : [formData.areaImages[areaKey] as string].filter(Boolean);
      const updated = [...areaImagesArray];
      updated.splice(index, 1);
      setFormData({ ...formData, areaImages: { ...formData.areaImages, [areaKey]: updated } });
    }
  };

  const moveAreaImage = (areaKey: string, index: number, direction: 'left' | 'right') => {
    if (formData.areaImages && formData.areaImages[areaKey]) {
      const areaImagesArray = Array.isArray(formData.areaImages[areaKey]) ? formData.areaImages[areaKey] as string[] : [formData.areaImages[areaKey] as string].filter(Boolean);
      const updated = [...areaImagesArray];
      if (direction === 'left' && index > 0) {
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      } else if (direction === 'right' && index < updated.length - 1) {
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      }
      setFormData({ ...formData, areaImages: { ...formData.areaImages, [areaKey]: updated } });
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number, listType: string, areaKey?: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ index, listType, areaKey }));
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number, listType: string, areaKey?: string) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.listType !== listType || data.areaKey !== areaKey || data.index === targetIndex) return;

      if (listType === 'images' && formData.images) {
        const updated = [...formData.images];
        const [draggedItem] = updated.splice(data.index, 1);
        updated.splice(targetIndex, 0, draggedItem);
        setFormData({ ...formData, images: updated });
      }

      if (listType === 'areaImages' && areaKey && formData.areaImages && formData.areaImages[areaKey]) {
        const areaImagesArray = Array.isArray(formData.areaImages[areaKey]) ? formData.areaImages[areaKey] as string[] : [formData.areaImages[areaKey] as string].filter(Boolean);
        const updated = [...areaImagesArray];
        const [draggedItem] = updated.splice(data.index, 1);
        updated.splice(targetIndex, 0, draggedItem);
        setFormData({ ...formData, areaImages: { ...formData.areaImages, [areaKey]: updated } });
      }
    } catch (err) {
      // Ignore invalid drag data
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
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

  const addPdfLink = () => {
    if (newPdfLink && formData.pdfLinks) {
      setFormData({ ...formData, pdfLinks: [...formData.pdfLinks, newPdfLink] });
      setNewPdfLink('');
    }
  };

  const removePdfLink = (index: number) => {
    if (formData.pdfLinks) {
      const updated = [...formData.pdfLinks];
      updated.splice(index, 1);
      setFormData({ ...formData, pdfLinks: updated });
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
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive !== false} 
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <label htmlFor="isActive" className="text-sm font-semibold cursor-pointer">
                  Aktiv (Sichtbar auf Webseite)
                </label>
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
              <div>
                <label className="block text-xs font-bold uppercase mb-1">iCal URL (optional - für Verfügbarkeitssync)</label>
                <input 
                  type="text" 
                  value={formData.icalUrl}
                  onChange={(e) => setFormData({...formData, icalUrl: e.target.value})}
                  placeholder="https://www.airbnb.de/calendar/ical/..."
                  className="w-full p-3 rounded-lg border border-border-main" 
                  disabled={submitting}
                />
                <p className="mt-1 text-[10px] text-text-secondary italic">Hinweis: Externe URLs können aufgrund von CORS Einschränkungen im Browser blockiert werden.</p>
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
                <label className="block text-xs font-bold uppercase mb-1">Bilder hinzufügen</label>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newImage}
                    placeholder="Bild-URL eingeben..."
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-grow p-3 rounded-lg border border-border-main" 
                    disabled={submitting || uploadingFiles['images']}
                  />
                  <button type="button" onClick={addImage} disabled={submitting || uploadingFiles['images']} className="bg-black text-white px-4 rounded-lg">
                    <ImageIcon size={18} />
                  </button>
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-black px-4 rounded-lg flex items-center justify-center transition-colors border border-gray-200">
                    <Upload size={18} className="mr-2" />
                    PC
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => handleCloudinaryUpload(e, 'images')} disabled={submitting || uploadingFiles['images']} />
                  </label>
                </div>
                {uploadingFiles['images'] && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Lade Dateien hoch... {uploadProgress['images'] || 0}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-black h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress['images'] || 0}%` }}></div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {formData.images?.map((img, i) => (
                     <div 
                       key={i} 
                       className="relative aspect-square rounded-lg overflow-hidden group border-2 border-transparent hover:border-gray-200 cursor-move"
                       draggable={!submitting}
                       onDragStart={(e) => handleDragStart(e, i, 'images')}
                       onDrop={(e) => handleDrop(e, i, 'images')}
                       onDragOver={handleDragOver}
                     >
                      <img src={img} referrerPolicy="no-referrer" className="w-full h-full object-cover pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col justify-between p-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <div className="flex justify-between pointer-events-auto">
                          <button 
                            type="button" 
                            onClick={() => moveImage(i, 'left')} 
                            disabled={i === 0 || submitting}
                            className="bg-white/90 p-2 lg:p-1.5 rounded-md hover:bg-white disabled:opacity-0 transition-opacity"
                          >
                            <ArrowLeft size={16} className="text-black" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => moveImage(i, 'right')} 
                            disabled={i === formData.images!.length - 1 || submitting}
                            className="bg-white/90 p-2 lg:p-1.5 rounded-md hover:bg-white disabled:opacity-0 transition-opacity"
                          >
                            <ArrowRight size={16} className="text-black" />
                          </button>
                        </div>
                        <div className="flex justify-center pointer-events-auto pb-1">
                          <button 
                            type="button"
                            onClick={() => removeImage(i)}
                            className="bg-white/90 p-2 lg:p-1.5 rounded-md hover:bg-white text-red-600 disabled:opacity-50"
                            disabled={submitting}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formData.type === 'sale' && (
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">PDF Dokumente (z.B. Grundriss)</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={newPdfLink}
                      onChange={(e) => setNewPdfLink(e.target.value)}
                      placeholder="PDF-URL eingeben..."
                      className="flex-grow p-3 rounded-lg border border-border-main" 
                      disabled={submitting || uploadingFiles['pdfLinks']}
                    />
                    <button type="button" onClick={addPdfLink} disabled={submitting || uploadingFiles['pdfLinks']} className="bg-black text-white px-4 rounded-lg">Hinzufügen</button>
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-black px-4 rounded-lg flex items-center justify-center transition-colors border border-gray-200">
                      <Upload size={18} className="mr-2" />
                      PC
                      <input type="file" multiple accept="application/pdf" className="hidden" onChange={(e) => handleCloudinaryUpload(e, 'pdfLinks')} disabled={submitting || uploadingFiles['pdfLinks']} />
                    </label>
                  </div>
                  {uploadingFiles['pdfLinks'] && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Lade PDF(s) hoch... {uploadProgress['pdfLinks'] || 0}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress['pdfLinks'] || 0}%` }}></div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    {formData.pdfLinks?.map((link, i) => (
                      <div key={i} className="bg-gray-100 px-3 py-2 rounded-lg text-sm flex justify-between items-center break-all">
                        <span>{link}</span>
                        <button type="button" onClick={() => removePdfLink(i)} className="text-red-500 shrink-0 ml-4">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase mb-4">Raum/Bereich Fotos</label>
                <div className="space-y-4">
                  {Object.entries(AREA_LABELS).map(([key, label]) => {
                    const fieldKey = `areaImages.${key}`;
                    const currentImages = Array.isArray(formData.areaImages?.[key]) ? (formData.areaImages[key] as string[]) : [formData.areaImages?.[key] as string].filter(Boolean);
                    
                    return (
                      <div key={key} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                          <label className="w-40 text-sm font-semibold">{label}</label>
                          <input 
                            type="text" 
                            value={currentImages.join(', ')}
                            onChange={(e) => setFormData({
                              ...formData, 
                              areaImages: { ...formData.areaImages, [key]: e.target.value.split(/[\s,]+/).filter(Boolean) }
                            })}
                            placeholder={`Bild-URLs für ${label} (mit Komma trennen)`}
                            className="flex-grow p-3 rounded-lg border border-border-main text-sm bg-white" 
                            disabled={submitting || uploadingFiles[fieldKey]}
                          />
                          <label className="cursor-pointer bg-white hover:bg-gray-100 text-black px-4 py-3 rounded-lg flex items-center justify-center transition-colors border border-gray-200">
                            <Upload size={18} className="mr-2" />
                            PC
                            <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => handleCloudinaryUpload(e, fieldKey)} disabled={submitting || uploadingFiles[fieldKey]} />
                          </label>
                        </div>
                        {uploadingFiles[fieldKey] && (
                          <div className="pl-0 sm:pl-44 mt-1">
                            <p className="text-sm text-gray-500 mb-1">Lade Bilder hoch... {uploadProgress[fieldKey] || 0}%</p>
                            <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5">
                              <div className="bg-black h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress[fieldKey] || 0}%` }}></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Display Area Images */}
                        {currentImages.length > 0 && (
                          <div className="pl-0 sm:pl-44 mt-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                              {currentImages.map((img, i) => (
                                <div 
                                  key={i} 
                                  className="relative aspect-square rounded-lg overflow-hidden group border-2 border-transparent hover:border-gray-200 cursor-move"
                                  draggable={!submitting}
                                  onDragStart={(e) => handleDragStart(e, i, 'areaImages', key)}
                                  onDrop={(e) => handleDrop(e, i, 'areaImages', key)}
                                  onDragOver={handleDragOver}
                                >
                                  <img src={img} referrerPolicy="no-referrer" className="w-full h-full object-cover pointer-events-none" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col justify-between p-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                    <div className="flex justify-between pointer-events-auto">
                                      <button 
                                        type="button" 
                                        onClick={() => moveAreaImage(key, i, 'left')} 
                                        disabled={i === 0 || submitting}
                                        className="bg-white/90 p-2 lg:p-1.5 rounded-md hover:bg-white disabled:opacity-0 transition-opacity"
                                      >
                                        <ArrowLeft size={16} className="text-black" />
                                      </button>
                                      <button 
                                        type="button" 
                                        onClick={() => moveAreaImage(key, i, 'right')} 
                                        disabled={i === currentImages.length - 1 || submitting}
                                        className="bg-white/90 p-2 lg:p-1.5 rounded-md hover:bg-white disabled:opacity-0 transition-opacity"
                                      >
                                        <ArrowRight size={16} className="text-black" />
                                      </button>
                                    </div>
                                    <div className="flex justify-center pointer-events-auto pb-1">
                                      <button 
                                        type="button"
                                        onClick={() => removeAreaImage(key, i)}
                                        className="bg-white/90 p-2 lg:p-1.5 rounded-md hover:bg-white text-red-600 disabled:opacity-50"
                                        disabled={submitting}
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                      setFormData({ title: '', location: '', price: '', description: '', type: 'rental', images: [], features: [], amenities: [], areaImages: {}, pdfLinks: [], isActive: true });
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
