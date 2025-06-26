import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Versions from './pages/Versions';
import Features from './pages/Features';
import Demo from './pages/Demo';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import TawkChat from './components/ui/TawkChat';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/versions" element={<Versions />} />
            <Route path="/features" element={<Features />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
        <Footer />
        <TawkChat />
      </div>
    </Router>
  );
}

export default App;