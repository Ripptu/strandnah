import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { auth, db, signInAnonymously } from '@/src/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password === 'vamela') {
      setLoading(true);
      try {
        // Sign in anonymously to Firebase (attempt, but don't block if disabled)
        try {
          await signInAnonymously(auth);
        } catch (authErr) {
          console.warn("Auth restriction detected, continuing with local token only.");
        }

        localStorage.setItem('admin_token', 'is_admin');
        navigate('/admin/dashboard');
      } catch (err: any) {
        console.error("Login error:", err);
        setError(`Fehler: ${err.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Ungültiges Passwort');
    }
  };

  return (
    <div className="pt-40 pb-20 flex justify-center px-6">
      <div className="w-full max-w-md bg-white border border-border-light rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-airbnb-red/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-airbnb-red" size={32} />
          </div>
          <h1 className="text-2xl font-bold">Admin-Schnittstelle</h1>
          <p className="text-text-secondary text-sm">Nur für autorisiertes Personal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-text-secondary px-1">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-border-main focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="••••••••"
              autoFocus
              disabled={loading}
            />
            {error && <p className="text-airbnb-red text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-airbnb-red text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Hefe den Chef an...' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
}
