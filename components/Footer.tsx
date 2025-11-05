import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary text-white mt-12 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="font-display text-2xl font-bold mb-4">Curio<span className="text-primary">z</span>ando</p>
        <div className="flex justify-center space-x-4 md:space-x-6 mb-4">
          <Link to="/privacy-policy" className="text-gray-300 hover:text-primary transition-colors">Política de Privacidade</Link>
          <Link to="/terms-of-use" className="text-gray-300 hover:text-primary transition-colors">Termos de Uso</Link>
          <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Contato</Link>
        </div>
        <p className="text-sm text-gray-400">&copy; {currentYear} Curiozando. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
