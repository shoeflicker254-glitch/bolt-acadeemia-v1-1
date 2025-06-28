import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Cloud, Server, Users, BookOpen, Award, Check, BarChart } from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestDemo = () => {
    navigate('/demo#demo-request-form');
  };

  const handleContactUs = () => {
    navigate('/contact');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-10 z-0"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                The #1 Complete <span className="text-primary-600">School Management</span> Solution
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8">
                Streamline administration, enhance learning experiences, and empower educational institutions with Acadeemia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" onClick={handleRequestDemo}>
                  Request Demo
                </Button>
                <Link to="/features" onClick={handleNavClick}>
                  <Button variant="outline" size="lg">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="School Management Platform" 
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Options Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title">Choose Your Ideal Deployment</h2>
          <p className="section-subtitle">
            Whether you prefer a cloud-based solution or self-hosted system, we've got you covered with two flexible deployment options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="card p-8 border-2 border-primary-200 bg-white rounded-xl transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-4 bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Cloud size={32} className="text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">SaaS (Cloud-Based)</h3>
              <p className="text-gray-600 mb-6">
                Access your school management system anywhere, anytime with our secure cloud-based solution. No installation or maintenance required.
              </p>
              <ul className="space-y-3 mb-8">
                {['Instant setup', 'Automatic updates', 'Scalable resources', 'Custom domain available*'].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={18} className="text-primary-600 mr-2 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <Link to="/versions" className="flex-1" onClick={handleNavClick}>
                  <Button variant="primary" fullWidth>
                    Learn More
                  </Button>
                </Link>
                <Button variant="outline" fullWidth onClick={handleRequestDemo}>
                  Try Demo
                </Button>
              </div>
            </div>

            <div className="card p-8 border-2 border-secondary-200 bg-white rounded-xl transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-4 bg-secondary-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Server size={32} className="text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Standalone (Self-Hosted)</h3>
              <p className="text-gray-600 mb-6">
                Full control over your data and infrastructure with our self-hosted solution, deployed and managed by our experts.
              </p>
              <ul className="space-y-3 mb-8">
                {['Complete data ownership', 'Customized infrastructure', 'Enhanced security', 'Hosting & domain service*'].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={18} className="text-secondary-600 mr-2 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <Link to="/versions" className="flex-1" onClick={handleNavClick}>
                  <Button variant="secondary" fullWidth>
                    More
                  </Button>
                </Link>
                <Button variant="outline" fullWidth onClick={handleRequestDemo}>
                  Try Demo
                </Button>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">* Additional service fees apply</p>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Empower Your Educational Institution</h2>
          <p className="section-subtitle">
            Designed with educators in mind, our comprehensive features streamline administration and enhance learning.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon={<Users size={24} />}
              title="Student Management"
              description="Comprehensive student profiles, attendance tracking, and performance analytics in one centralized system."
            />
            <FeatureCard
              icon={<BookOpen size={24} />}
              title="Academic Management"
              description="Easily manage courses, curriculum, assignments, and generate detailed grade reports."
            />
            <FeatureCard
              icon={<BarChart size={24} />}
              title="Financial Management"
              description="Streamline fee collection, track expenses, and generate financial reports with minimal effort."
            />
            <FeatureCard
              icon={<Award size={24} />}
              title="Certification System"
              description="Create, manage and distribute certificates and transcripts for completed courses and programs."
            />
            <FeatureCard
              icon={<Cloud size={24} />}
              title="Resource Library"
              description="Digital library for educational resources, accessible to students and faculty anytime, anywhere."
            />
            <FeatureCard
              icon={<Server size={24} />}
              title="Customizable Modules"
              description="Extend functionality with add-ons designed for your institution's specific requirements."
            />
          </div>

          <div className="text-center mt-12">
            <Link to="/features" onClick={handleNavClick}>
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                Explore All Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title">Trusted by Educational Institutions</h2>
          <p className="section-subtitle">
            Join hundreds of schools and colleges worldwide who trust Acadeemia for their management needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                quote: "Acadeemia transformed our administrative processes, saving us countless hours and improving communication with students and parents.",
                author: "Dr. Maria Johnson",
                position: "Principal, Westlake Academy"
              },
              {
                quote: "The flexibility to choose between cloud and self-hosted options made Acadeemia the perfect solution for our college's specific needs.",
                author: "Prof. James Anderson",
                position: "Dean, Riverside College"
              },
              {
                quote: "The add-on modules allowed us to customize the system exactly to our requirements. Outstanding support team too!",
                author: "Sarah Williams",
                position: "IT Director, Global Education Institute"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card">
                <div className="mb-4 text-primary-600">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
                <p className="italic mb-6 text-gray-700">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Institution?</h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Start your journey with Acadeemia today and experience the difference our system can make.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-primary hover:bg-white/10 hover:text-white"
                onClick={handleContactUs}
              >
                Contact Us
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-primary hover:bg-white/10 hover:text-white"
                onClick={handleRequestDemo}
              >
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;