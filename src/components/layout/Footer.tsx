import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  // Scroll to top when clicking navigation links
  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Acadeemia</h3>
            <p className="text-gray-400 mb-4">
              Providing powerful and flexible school management solutions designed to elevate educational institutions.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/ACADEEMIA134163" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61556455472009" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/acadeemia_sms/" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/acadeemia/" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://www.youtube.com/channel/UCogUoc9Y4HgSdBVo24FrQWw" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors" onClick={handleNavClick}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/versions" className="text-gray-400 hover:text-white transition-colors" onClick={handleNavClick}>
                  Versions
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-white transition-colors" onClick={handleNavClick}>
                  Features
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-gray-400 hover:text-white transition-colors" onClick={handleNavClick}>
                  Request Demo
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors" onClick={handleNavClick}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors" onClick={handleNavClick}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors" onClick={handleNavClick}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors" onClick={handleNavClick}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors" onClick={handleNavClick}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition-colors" onClick={handleNavClick}>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-primary-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400">90 JGO James Gichuru Road Nairobi City, 00100</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400">+254 111 313 818</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400">info@acadeemia.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Acadeemia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;