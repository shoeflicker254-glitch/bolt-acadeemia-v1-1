import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle, Mail } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="section">
        <div className="container max-w-4xl">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-8">
            <div className="flex items-start">
              <Shield size={24} className="text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Last Updated: January 1, 2025</h3>
                <p className="text-green-800">
                  This Privacy Policy explains how Acadeemia collects, uses, and protects your personal information when you use our school management services.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Eye size={24} className="mr-2 text-primary-600" />
              1. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <p className="mb-4">We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Account registration information (name, email, phone number)</li>
              <li>School and institutional details</li>
              <li>Student and staff information entered into the system</li>
              <li>Payment and billing information</li>
              <li>Communication preferences and support requests</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Usage data and system logs</li>
              <li>IP addresses and device information</li>
              <li>Browser type and operating system</li>
              <li>Access times and referring websites</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Database size={24} className="mr-2 text-primary-600" />
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide and maintain our school management services</li>
              <li>Process transactions and manage subscriptions</li>
              <li>Communicate with you about your account and our services</li>
              <li>Provide customer support and technical assistance</li>
              <li>Improve our services and develop new features</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <UserCheck size={24} className="mr-2 text-primary-600" />
              3. Information Sharing and Disclosure
            </h2>
            <p className="mb-4">We do not sell, trade, or rent your personal information. We may share information in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold mb-3">With Your Consent</h3>
            <p className="mb-4">We may share information when you explicitly consent to such sharing.</p>

            <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
            <p className="mb-4">We may share information with trusted third-party service providers who assist us in:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Cloud hosting and infrastructure services</li>
              <li>Payment processing</li>
              <li>Email and communication services</li>
              <li>Analytics and performance monitoring</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
            <p className="mb-6">We may disclose information when required by law or to protect our rights, property, or safety.</p>

            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Lock size={24} className="mr-2 text-primary-600" />
              4. Data Security
            </h2>
            <p className="mb-4">We implement comprehensive security measures to protect your information:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection practices</li>
              <li>Incident response and breach notification procedures</li>
              <li>Compliance with industry security standards</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
            <p className="mb-4">We retain your information for as long as necessary to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Maintain business records as required</li>
            </ul>
            <p className="mb-6">
              Upon termination of your account, we will delete or anonymize your personal information within a reasonable timeframe, unless retention is required by law.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Your Rights and Choices</h2>
            <p className="mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Objection:</strong> Object to certain types of processing</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">7. International Data Transfers</h2>
            <p className="mb-6">
              If you are located outside Kenya, your information may be transferred to and processed in Kenya or other countries where we operate. We ensure appropriate safeguards are in place to protect your information during such transfers.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
            <p className="mb-6">
              Our services are designed for educational institutions and may contain information about students under 18. We collect and process student information only as necessary to provide our educational management services and in compliance with applicable laws such as FERPA and COPPA.
            </p>

            <h2 className="text-2xl font-bold mb-4">9. Cookies and Tracking Technologies</h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Remember your preferences and settings</li>
              <li>Analyze usage patterns and improve our services</li>
              <li>Provide security features</li>
              <li>Deliver relevant content and advertisements</li>
            </ul>
            <p className="mb-6">You can control cookie settings through your browser preferences.</p>

            <h2 className="text-2xl font-bold mb-4">10. Third-Party Links</h2>
            <p className="mb-6">
              Our services may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any information.
            </p>

            <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
            <p className="mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through our service. Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <Mail size={20} className="text-primary-600 mr-2" />
                <span className="font-medium">Privacy Officer:</span>
                <a href="mailto:privacy@acadeemia.com" className="ml-2 text-primary-600 hover:text-primary-700">
                  privacy@acadeemia.com
                </a>
              </div>
              <p className="text-gray-600">
                Acadeemia<br />
                90 JGO James Gichuru Road<br />
                Nairobi City, 00100<br />
                Kenya<br />
                Phone: +254 111 313 818
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;