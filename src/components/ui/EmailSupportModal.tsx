import React, { useState } from 'react';
import { X, Send, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';

interface EmailSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailSupportModal: React.FC<EmailSupportModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    supportType: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const supportTypes = [
    'Technical Issue',
    'Billing Question',
    'Feature Request',
    'Bug Report',
    'Account Access',
    'Training Support',
    'General Inquiry',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-support-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit support request');
      }

      setSubmitSuccess(true);
      setTicketNumber(result.ticketNumber || '');
      setEmailSent(result.emailSent || false);
      setFormData({
        senderName: '',
        senderEmail: '',
        subject: '',
        supportType: '',
        message: ''
      });

      // Close modal after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setTicketNumber('');
        setEmailSent(false);
        onClose();
      }, 5000);
    } catch (error) {
      console.error('Error submitting support request:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        senderName: '',
        senderEmail: '',
        subject: '',
        supportType: '',
        message: ''
      });
      setSubmitError('');
      setSubmitSuccess(false);
      setTicketNumber('');
      setEmailSent(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-50 rounded-lg mr-3">
                <Mail size={24} className="text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Email Support</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-green-800 mb-6 animate-fade-in">
              <div className="flex items-center">
                <CheckCircle size={20} className="mr-2" />
                <span className="font-medium">Support request submitted successfully!</span>
              </div>
              {ticketNumber && (
                <p className="mt-1 text-sm">
                  <strong>Ticket Number:</strong> {ticketNumber}
                </p>
              )}
              <p className="mt-1 text-sm">
                {emailSent 
                  ? "Our support team has been notified and will get back to you within 24 hours."
                  : "Your request has been saved and our team will review it and contact you via email."
                }
              </p>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-800 mb-6 animate-fade-in">
              <div className="flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <span className="font-medium">Error submitting support request</span>
              </div>
              <p className="text-sm mt-1">{submitError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  id="senderName"
                  name="senderName"
                  type="text"
                  required
                  value={formData.senderName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 disabled:opacity-50"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email *
                </label>
                <input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  required
                  value={formData.senderEmail}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 disabled:opacity-50"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="supportType" className="block text-sm font-medium text-gray-700 mb-1">
                  Support Type *
                </label>
                <select
                  id="supportType"
                  name="supportType"
                  required
                  value={formData.supportType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 disabled:opacity-50"
                >
                  <option value="">Select support type</option>
                  {supportTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 disabled:opacity-50"
                  placeholder="Brief description of your issue"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 disabled:opacity-50"
                placeholder="Please provide detailed information about your issue or question..."
              ></textarea>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your support request will be saved with a unique ticket number</li>
                <li>• Our support team will be notified immediately</li>
                <li>• You'll receive a response to your email address within 24 hours</li>
                <li>• For urgent issues, please call +254 111 313 818</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                icon={<Send size={18} />}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailSupportModal;