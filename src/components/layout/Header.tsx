import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => location.pathname === path;

  // Scroll to top when clicking navigation links
  const handleNavClick = () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={handleNavClick}>
          <img 
            src="https://cfdptmabmfdmaiphtcqa.supabase.co/storage/v1/object/sign/acadeemia-bolt/acadeemia-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81NmM2NjMyZS0yMmZkLTRkMDAtYTI5ZS05MzVmNWFmOTBhNDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhY2FkZWVtaWEtYm9sdC9hY2FkZWVtaWEtbG9nby5wbmciLCJpYXQiOjE3NTA3NTAzMTUsImV4cCI6MzMyODY3NTAzMTV9.OIlwvdnuomUOtCYPQ4uIsvMRY12r3PdL9PEHVqKkxSk"
            alt="Acadeemia Logo" 
            className="h-12"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`font-medium transition-colors hover:text-primary-600 ${
              isActive('/') ? 'text-primary-600' : 'text-gray-700'
            }`}
            onClick={handleNavClick}
          >
            Home
          </Link>
          <Link 
            to="/versions" 
            className={`font-medium transition-colors hover:text-primary-600 ${
              isActive('/versions') ? 'text-primary-600' : 'text-gray-700'
            }`}
            onClick={handleNavClick}
          >
            Versions
          </Link>
          <Link 
            to="/features" 
            className={`font-medium transition-colors hover:text-primary-600 ${
              isActive('/features') ? 'text-primary-600' : 'text-gray-700'
            }`}
            onClick={handleNavClick}
          >
            Features
          </Link>
          <Link 
            to="/demo" 
            className={`font-medium transition-colors hover:text-primary-600 ${
              isActive('/demo') ? 'text-primary-600' : 'text-gray-700'
            }`}
            onClick={handleNavClick}
          >
            Demo
          </Link>
          <Link 
            to="/pricing" 
            className={`font-medium transition-colors hover:text-primary-600 ${
              isActive('/pricing') ? 'text-primary-600' : 'text-gray-700'
            }`}
            onClick={handleNavClick}
          >
            Pricing
          </Link>
          <Link 
            to="/store" 
            className={`font-medium transition-colors hover:text-primary-600 ${
              isActive('/store') ? 'text-primary-600' : 'text-gray-700'
            }`}
            onClick={handleNavClick}
          >
            Store
          </Link>
          <Link 
            to="/about" 
            className={`font-medium transition-colors hover:text-primary-600 ${
              isActive('/about') ? 'text-primary-600' : 'text-gray-700'
            }`}
            onClick={handleNavClick}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="btn-primary"
            onClick={handleNavClick}
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white w-full shadow-lg animate-fade-in">
          <nav className="container py-5 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`font-medium p-2 rounded-lg transition-colors ${
                isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={handleNavClick}
            >
              Home
            </Link>
            <Link 
              to="/versions" 
              className={`font-medium p-2 rounded-lg transition-colors ${
                isActive('/versions') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={handleNavClick}
            >
              Versions
            </Link>
            <Link 
              to="/features" 
              className={`font-medium p-2 rounded-lg transition-colors ${
                isActive('/features') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={handleNavClick}
            >
              Features
            </Link>
            <Link 
              to="/demo" 
              className={`font-medium p-2 rounded-lg transition-colors ${
                isActive('/demo') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={handleNavClick}
            >
              Demo
            </Link>
            <Link 
              to="/pricing" 
              className={`font-medium p-2 rounded-lg transition-colors ${
                isActive('/pricing') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={handleNavClick}
            >
              Pricing
            </Link>
            <Link 
              to="/store" 
              className={`font-medium p-2 rounded-lg transition-colors ${
                isActive('/store') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={handleNavClick}
            >
              Store
            </Link>
            <Link 
              to="/about" 
              className={`font-medium p-2 rounded-lg transition-colors ${
                isActive('/about') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={handleNavClick}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="btn-primary text-center"
              onClick={handleNavClick}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;