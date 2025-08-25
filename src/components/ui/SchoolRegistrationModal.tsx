import React, { useState } from 'react';
import { X, User, Mail, Phone, Building, MapPin, Globe, CreditCard, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from './Button';
import Card from './Card';

interface SchoolRegistrationData {
  // Admin user data
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  adminConfirmPassword: string;
  
  // School data
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  schoolWebsite: string;
  schoolType: string;
  studentCount: string;
  
  // Selected plan
  selectedPlan: any;
}

interface SchoolRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: any;
  onRegistrationComplete: (data: SchoolRegistrationData) => void;
}

const SchoolRegistrationModal: React.FC<SchoolRegistrationModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onRegistrationComplete
}) => {
  const [step, setStep] = useState<'admin' | 'school' | 'review'>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<SchoolRegistrationData>({
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    adminConfirmPassword: '',
    schoolName: '',
    schoolAddress: '',
    schoolPhone: '',
    schoolEmail: '',
    schoolWebsite: '',
    schoolType: '',
    studentCount: '',
    selectedPlan: selectedPlan
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateAdminStep = () => {
    if (!formData.adminFirstName || !formData.adminLastName || !formData.adminEmail || !formData.adminPassword) {
      setError('Please fill in all required admin fields');
      return false;
    }
    
    if (formData.adminPassword !== formData.adminConfirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.adminPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.adminEmail)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const validateSchoolStep = () => {
    if (!formData.schoolName || !formData.schoolAddress || !formData.schoolType || !formData.studentCount) {
      setError('Please fill in all required school fields');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 'admin') {
      if (validateAdminStep()) {
        setStep('school');
      }
    } else if (step === 'school') {
      if (validateSchoolStep()) {
        setStep('review');
      }
    }
  };

  const handlePreviousStep = () => {
    if (step === 'school') {
      setStep('admin');
    } else if (step === 'review') {
      setStep('school');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(formData.adminEmail);
      
      if (existingUser.user) {
        setError('An account with this email already exists');
        setLoading(false);
        return;
      }

      // Proceed to payment
      onRegistrationComplete(formData);
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">School Registration</h2>
              <p className="text-gray-600">Step {step === 'admin' ? '1' : step === 'school' ? '2' : '3'} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'admin' ? 'bg-primary-600 text-white' : 'bg-primary-600 text-white'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step === 'school' || step === 'review' ? 'bg-primary-600' : 'bg-gray-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'school' ? 'bg-primary-600 text-white' : 
                step === 'review' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step === 'review' ? 'bg-primary-600' : 'bg-gray-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'review' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Admin Details</span>
              <span>School Details</span>
              <span>Review & Payment</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle size={20} className="text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {/* Step 1: Admin Details */}
          {step === 'admin' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User size={20} className="mr-2 text-primary-600" />
                  Administrator Account Details
                </h3>
                <p className="text-gray-600 mb-6">
                  Create the main administrator account for your school.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="adminFirstName"
                    value={formData.adminFirstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="adminLastName"
                    value={formData.adminLastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="adminPhone"
                  value={formData.adminPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="adminConfirmPassword"
                    value={formData.adminConfirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="primary" onClick={handleNextStep}>
                  Next: School Details
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: School Details */}
          {step === 'school' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building size={20} className="mr-2 text-primary-600" />
                  School Information
                </h3>
                <p className="text-gray-600 mb-6">
                  Provide details about your educational institution.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name *
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Address *
                </label>
                <input
                  type="text"
                  name="schoolAddress"
                  value={formData.schoolAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Phone
                  </label>
                  <input
                    type="tel"
                    name="schoolPhone"
                    value={formData.schoolPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Email
                  </label>
                  <input
                    type="email"
                    name="schoolEmail"
                    value={formData.schoolEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Website
                </label>
                <input
                  type="url"
                  name="schoolWebsite"
                  value={formData.schoolWebsite}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://yourschool.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Type *
                  </label>
                  <select
                    name="schoolType"
                    value={formData.schoolType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select school type</option>
                    <option value="primary">Primary School</option>
                    <option value="secondary">Secondary School</option>
                    <option value="college">College</option>
                    <option value="university">University</option>
                    <option value="vocational">Vocational Institute</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Student Count *
                  </label>
                  <select
                    name="studentCount"
                    value={formData.studentCount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select range</option>
                    <option value="1-50">1-50 students</option>
                    <option value="51-200">51-200 students</option>
                    <option value="201-500">201-500 students</option>
                    <option value="501-1000">501-1000 students</option>
                    <option value="1000+">1000+ students</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Previous
                </Button>
                <Button variant="primary" onClick={handleNextStep}>
                  Next: Review
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Check size={20} className="mr-2 text-primary-600" />
                  Review Your Information
                </h3>
                <p className="text-gray-600 mb-6">
                  Please review your details before proceeding to payment.
                </p>
              </div>

              {/* Selected Plan */}
              <Card className="p-4 border-2 border-primary-200">
                <h4 className="font-semibold text-primary-600 mb-2">Selected Plan</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{selectedPlan.title}</p>
                    <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{selectedPlan.price}</p>
                    <p className="text-sm text-gray-600">per {selectedPlan.period}</p>
                  </div>
                </div>
              </Card>

              {/* Admin Details */}
              <div>
                <h4 className="font-semibold mb-3">Administrator Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {formData.adminFirstName} {formData.adminLastName}</p>
                  <p><span className="font-medium">Email:</span> {formData.adminEmail}</p>
                  {formData.adminPhone && <p><span className="font-medium">Phone:</span> {formData.adminPhone}</p>}
                </div>
              </div>

              {/* School Details */}
              <div>
                <h4 className="font-semibold mb-3">School Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {formData.schoolName}</p>
                  <p><span className="font-medium">Address:</span> {formData.schoolAddress}</p>
                  <p><span className="font-medium">Type:</span> {formData.schoolType}</p>
                  <p><span className="font-medium">Student Count:</span> {formData.studentCount}</p>
                  {formData.schoolPhone && <p><span className="font-medium">Phone:</span> {formData.schoolPhone}</p>}
                  {formData.schoolEmail && <p><span className="font-medium">Email:</span> {formData.schoolEmail}</p>}
                  {formData.schoolWebsite && <p><span className="font-medium">Website:</span> {formData.schoolWebsite}</p>}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Previous
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSubmit}
                  disabled={loading}
                  icon={<CreditCard size={18} />}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistrationModal;