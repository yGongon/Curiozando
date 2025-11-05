import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { auth, signOut } from '../services/firebase';


const navLinks = [
  { name: 'Início', path: '/' },
  { name: 'Curiosidades', path: '/category/curiosidades' },
  { name: 'Fatos do Mundo', path: '/category/fatos-do-mundo' },
  { name: 'Mistérios', path: '/category/misterios' },
  { name: 'Ciência', path: '/category/ciencia' },
  { name: 'Contato', path: '/contact' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header className="bg-white border-b-2 border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-3xl font-display font-bold text-secondary">
            Curio<span className="text-primary">z</span>ando
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `font-bold text-sm uppercase tracking-wider transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {!loading && user && (
              <>
                 <NavLink
                    to="/admin"
                    className={({ isActive }) => `font-bold text-sm uppercase tracking-wider transition-colors duration-300 ${ isActive ? 'text-primary' : 'text-secondary hover:text-primary' }`}
                  >
                   Painel Admin
                  </NavLink>
                <button onClick={handleLogout} className="font-bold text-sm uppercase text-red-500 hover:text-red-700 transition-colors">Sair</button>
              </>
            )}
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `font-bold text-lg ${isActive ? 'text-primary' : 'text-secondary'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
             {!loading && user && (
              <>
                 <NavLink
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => `font-bold text-lg ${isActive ? 'text-primary' : 'text-secondary'}`}
                  >
                   Painel Admin
                  </NavLink>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="font-bold text-lg text-red-500">Sair</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;