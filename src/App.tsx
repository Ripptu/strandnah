import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Rentals from './pages/Rentals';
import Sales from './pages/Sales';
import Location from './pages/Location';
import Contact from './pages/Contact';
import ListingDetail from './pages/ListingDetail';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import AGB from './pages/AGB';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { auth } from './lib/firebase';

// Placeholder components for other legal pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="pt-32 pb-20 max-w-3xl mx-auto px-6">
    <h1 className="text-4xl font-bold mb-8">{title}</h1>
    <p className="text-text-secondary">Dies ist ein Platzhalter für {title.toLowerCase()}. In einer echten Anwendung würden hier die vollständigen rechtlichen Texte stehen.</p>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // We primarily trust the localStorage token for the UI state
    // Firestore rules will handle the actual data security
    const hasToken = localStorage.getItem('admin_token') === 'is_admin';
    setIsAdmin(hasToken);
  }, []);

  if (isAdmin === null) return <div className="pt-40 text-center">Prüfe Berechtigung...</div>;
  return isAdmin ? <>{children}</> : <Navigate to="/admin" replace />;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ferienwohnungen" element={<Rentals />} />
            <Route path="/ferienwohnungen/:id" element={<ListingDetail />} />
            <Route path="/eigentumswohnungen" element={<Sales />} />
            <Route path="/eigentumswohnungen/:id" element={<ListingDetail />} />
            <Route path="/lage" element={<Location />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
