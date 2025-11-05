import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/PostPage';
import PlaceholderPage from './pages/LoginPage'; // Now a generic placeholder
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPageActual'; // New Login Page
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/category/curiosidades" element={<PlaceholderPage title="Curiosidades" />} />
              <Route path="/category/fatos-do-mundo" element={<PlaceholderPage title="Fatos do Mundo" />} />
              <Route path="/category/misterios" element={<PlaceholderPage title="Mistérios" />} />
              <Route path="/category/ciencia" element={<PlaceholderPage title="Ciência" />} />
              <Route path="/contact" element={<PlaceholderPage title="Contato" />} />
              <Route path="/privacy-policy" element={<PlaceholderPage title="Política de Privacidade" />} />
              <Route path="/terms-of-use" element={<PlaceholderPage title="Termos de Uso" />} />

              {/* Admin Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;