import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, FileText, Mail, Phone } from 'lucide-react';
import Button from './Button';
import Card from './Card';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const merchantReference = searchParams.get('OrderMerchantReference');

    if (orderTrackingId) {
      // Verify payment status with our backend
      verifyPaymentStatus(orderTrackingId);
    } else {
      setLoading(false);
      setPaymentStatus('failed');
    }
  }, [searchParams]);

  const verifyPaymentStatus = async (trackingId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderTrackingId: trackingId })
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus('success');
        setOrderDetails(result.orderDetails);
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {paymentStatus === 'success' ? (
          <Card className="text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Welcome to Acadeemia! Your school has been successfully registered and your subscription is now active.
            </p>

            {orderDetails && (
              <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
                <h3 className="font-semibold mb-4">Order Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Order ID:</span> {orderDetails.orderId}</p>
                  <p><span className="font-medium">School:</span> {orderDetails.schoolName}</p>
                  <p><span className="font-medium">Plan:</span> {orderDetails.planName}</p>
                  <p><span className="font-medium">Amount:</span> {orderDetails.amount}</p>
                  <p><span className="font-medium">Payment Method:</span> {orderDetails.paymentMethod}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <FileText size={20} className="text-blue-600 mb-2" />
                  <h4 className="font-medium mb-1">Setup Your School</h4>
                  <p className="text-sm text-gray-600">
                    Access your dashboard to configure your school settings, add staff, and import student data.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <Mail size={20} className="text-green-600 mb-2" />
                  <h4 className="font-medium mb-1">Check Your Email</h4>
                  <p className="text-sm text-gray-600">
                    We've sent you login credentials and setup instructions to get started.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button variant="primary" onClick={handleGoToDashboard} className="flex-1">
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={handleGoHome} className="flex-1">
                Back to Home
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Need help getting started?</p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <a href="mailto:support@acadeemia.com" className="text-primary-600 hover:text-primary-700 flex items-center">
                  <Mail size={16} className="mr-1" />
                  Email Support
                </a>
                <a href="tel:+254111313818" className="text-primary-600 hover:text-primary-700 flex items-center">
                  <Phone size={16} className="mr-1" />
                  Call Support
                </a>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="text-center p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={40} className="text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              We couldn't process your payment. Please try again or contact our support team for assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" onClick={() => navigate('/pricing')} className="flex-1">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/contact')} className="flex-1">
                Contact Support
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;