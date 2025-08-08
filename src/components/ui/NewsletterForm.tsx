import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from './Button';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Check if email already exists
      const { data: existing, error: checkError } = await supabase
        .from('newsletter_subscriptions')
        .select('id, status')
        .eq('email', email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        if (existing.status === 'active') {
          setSubmitError('This email is already subscribed to our newsletter.');
          return;
        } else {
          // Reactivate subscription
          const { error: updateError } = await supabase
            .from('newsletter_subscriptions')
            .update({
              status: 'active',
              name: name || null,
              subscribed_at: new Date().toISOString(),
              unsubscribed_at: null,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;
        }
      } else {
        // Create new subscription
        const { error: insertError } = await supabase
          .from('newsletter_subscriptions')
          .insert({
            email: email,
            name: name || null,
            status: 'active',
            source: 'website'
          });

        if (insertError) throw insertError;
      }

      setSubmitSuccess(true);
      setEmail('');
      setName('');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to subscribe. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center mb-4">
        <Mail size={24} className="text-primary-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
      </div>
      
      <p className="text-gray-300 mb-4">
        Get the latest updates about Acadeemia.
      </p>

      {submitSuccess && (
        <div className="bg-green-900 border border-green-700 p-3 rounded-lg mb-4 flex items-center">
          <CheckCircle size={16} className="text-green-400 mr-2" />
          <span className="text-green-100 text-sm">
            Successfully subscribed! Thank you for joining our newsletter.
          </span>
        </div>
      )}

      {submitError && (
        <div className="bg-red-900 border border-red-700 p-3 rounded-lg mb-4 flex items-center">
          <AlertCircle size={16} className="text-red-400 mr-2" />
          <span className="text-red-100 text-sm">{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
          icon={<Send size={16} />}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>

      <p className="text-xs text-gray-400 mt-3">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterForm;