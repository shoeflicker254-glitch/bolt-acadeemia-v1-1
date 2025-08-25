import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Building, Check, AlertCircle, Loader } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationData: any;
  onPaymentSuccess: () => void;
}

interface PesaPalConfig {
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'live';
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  registrationData,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const pesapalConfig: PesaPalConfig = {
    consumerKey: '/GxfrKl1sTaIXmTU49AldY+ykQmEB7TU',
    consumerSecret: '8hO8hrD+DlNeb9fAgxbex2HDiHs=',
    environment: 'sandbox' // Change to 'live' for production
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const initiatePesaPalPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const orderId = generateOrderId();
      const amount = parseFloat(registrationData.selectedPlan.price.replace(/[^0-9.]/g, ''));
      
      // Prepare payment data for PesaPal
      const paymentPayload = {
        id: orderId,
        currency: 'KES',
        amount: amount,
        description: `${registrationData.selectedPlan.title} Plan - ${registrationData.schoolName}`,
        callback_url: `${window.location.origin}/payment/callback`,
        notification_id: orderId,
        billing_address: {
          email_address: registrationData.adminEmail,
          phone_number: paymentData.phoneNumber || registrationData.adminPhone,
          country_code: 'KE',
          first_name: registrationData.adminFirstName,
          last_name: registrationData.adminLastName,
          line_1: registrationData.schoolAddress,
          city: 'Nairobi',
          state: 'Nairobi',
          postal_code: '00100'
        }
      };

      // Call our edge function to handle PesaPal integration
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentData: paymentPayload,
          registrationData: registrationData,
          paymentMethod: paymentMethod
        })
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to PesaPal payment page
        if (result.redirect_url) {
          window.location.href = result.redirect_url;
        } else {
          // Handle successful payment processing
          onPaymentSuccess();
        }
      } else {
        setError(result.error || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'mpesa' && !paymentData.phoneNumber) {
      setError('Please enter your M-Pesa phone number');
      return;
    }

    if (paymentMethod === 'card') {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardName) {
        setError('Please fill in all card details');
        return;
      }
    }

    await initiatePesaPalPayment();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
              <p className="text-gray-600">Secure payment powered by PesaPal</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle size={20} className="text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {/* Order Summary */}
          <Card className="p-4 mb-6 border-2 border-primary-200">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium">{registrationData.selectedPlan.title}</span>
              </div>
              <div className="flex justify-between">
                <span>School:</span>
                <span className="font-medium">{registrationData.schoolName}</span>
              </div>
              <div className="flex justify-between">
                <span>Period:</span>
                <span className="font-medium">Per {registrationData.selectedPlan.period}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary-600">{registrationData.selectedPlan.price}</span>
              </div>
            </div>
          </Card>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mpesa"
                  checked={paymentMethod === 'mpesa'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <Smartphone size={20} className="text-green-600 mr-3" />
                <div>
                  <span className="font-medium">M-Pesa</span>
                  <p className="text-sm text-gray-600">Pay with your M-Pesa mobile money</p>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <CreditCard size={20} className="text-blue-600 mr-3" />
                <div>
                  <span className="font-medium">Credit/Debit Card</span>
                  <p className="text-sm text-gray-600">Visa, Mastercard, and other major cards</p>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <Building size={20} className="text-purple-600 mr-3" />
                <div>
                  <span className="font-medium">Bank Transfer</span>
                  <p className="text-sm text-gray-600">Direct bank transfer</p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === 'mpesa' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                M-Pesa Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={paymentData.phoneNumber}
                onChange={handleInputChange}
                placeholder="254712345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your M-Pesa registered phone number
              </p>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={paymentData.cardName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <Check size={20} className="text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-blue-800">
                <p className="font-medium mb-1">Secure Payment</p>
                <p className="text-sm">
                  Your payment is processed securely through PesaPal. We don't store your payment information.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handlePayment}
              disabled={loading}
              icon={loading ? <Loader size={18} className="animate-spin" /> : <CreditCard size={18} />}
            >
              {loading ? 'Processing Payment...' : `Pay ${registrationData.selectedPlan.price}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;