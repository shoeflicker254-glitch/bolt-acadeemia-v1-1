import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, AlertTriangle, Mail } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Please read these terms carefully before using Acadeemia services.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section">
        <div className="container max-w-4xl">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
            <div className="flex items-start">
              <AlertTriangle size={24} className="text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Last Updated: January 1, 2025</h3>
                <p className="text-blue-800">
                  These Terms of Service govern your use of Acadeemia's school management system and related services.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FileText size={24} className="mr-2 text-primary-600" />
              1. Acceptance of Terms
            </h2>
            <p className="mb-6">
              By accessing or using Acadeemia's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Acadeemia provides comprehensive school management software solutions available in two deployment options:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>SaaS Version:</strong> Cloud-based software as a service with subscription-based pricing</li>
              <li><strong>Standalone Version:</strong> Self-hosted software with yearly licensing fees</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">3. User Accounts and Registration</h2>
            <p className="mb-4">
              To access certain features of our service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">4. Subscription and Payment Terms</h2>
            <h3 className="text-xl font-semibold mb-3">SaaS Version</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Subscriptions are billed on a termly or annual basis</li>
              <li>Payment is due in advance for each billing period</li>
              <li>Free trial periods are available for new customers</li>
              <li>Subscription fees are non-refundable except as required by law</li>
              <li>We reserve the right to change pricing with 30 days notice</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Standalone Version</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>One-time license fees are required for software purchase</li>
              <li>Additional services (hosting, support) are billed separately</li>
              <li>Maintenance and support contracts are optional but recommended</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">5. Acceptable Use Policy</h2>
            <p className="mb-4">You agree not to use our services to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt our services</li>
              <li>Use our services for any illegal or unauthorized purpose</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">6. Data Ownership and Privacy</h2>
            <p className="mb-4">
              You retain ownership of all data you input into our system. We are committed to protecting your privacy and handling your data responsibly:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Your data is used solely to provide our services</li>
              <li>We implement industry-standard security measures</li>
              <li>Data processing complies with applicable privacy laws</li>
              <li>You can export your data at any time</li>
              <li>See our Privacy Policy for detailed information</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
            <p className="mb-6">
              The Acadeemia software, including all content, features, and functionality, is owned by Acadeemia and protected by international copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive license to use our software in accordance with these terms.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Service Availability and Support</h2>
            <p className="mb-4">
              We strive to maintain high service availability but cannot guarantee uninterrupted service:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>SaaS services target 99.9% uptime</li>
              <li>Scheduled maintenance will be announced in advance</li>
              <li>Support is provided during business hours</li>
              <li>Emergency support is available for critical issues</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
            <p className="mb-6">
              To the maximum extent permitted by law, Acadeemia shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our services.
            </p>

            <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
            <p className="mb-4">
              Either party may terminate this agreement:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>You may cancel your subscription at any time</li>
              <li>We may terminate for breach of these terms</li>
              <li>Upon termination, you retain the right to export your data</li>
              <li>Standalone licenses remain valid after termination of support services</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
            <p className="mb-6">
              These terms are governed by the laws of Kenya. Any disputes will be resolved in the courts of Nairobi, Kenya.
            </p>

            <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through our service. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <Mail size={20} className="text-primary-600 mr-2" />
                <span className="font-medium">Email:</span>
                <a href="mailto:legal@acadeemia.com" className="ml-2 text-primary-600 hover:text-primary-700">
                  legal@acadeemia.com
                </a>
              </div>
              <p className="text-gray-600">
                Acadeemia<br />
                90 JGO James Gichuru Road<br />
                Nairobi City, 00100<br />
                Kenya
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;