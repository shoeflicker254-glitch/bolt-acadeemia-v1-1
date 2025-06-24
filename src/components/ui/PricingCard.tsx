import React from 'react';
import { Check } from 'lucide-react';
import Button from './Button';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period?: string;
  features: PricingFeature[];
  highlight?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  badge?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  period = 'term',
  features,
  highlight = false,
  buttonText = 'Get Started',
  onButtonClick,
  badge,
}) => {
  return (
    <div className={`h-full rounded-xl overflow-hidden transition-all duration-200 ${
      highlight 
        ? 'border-2 border-primary-500 shadow-lg' 
        : 'border border-gray-200 shadow-sm hover:shadow-md'
    }`}>
      {badge && (
        <div className="bg-primary-600 py-1.5 px-4 text-white text-sm font-medium text-center">
          {badge}
        </div>
      )}
      
      <div className="p-6 sm:p-8 bg-white h-full flex flex-col">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          
          <div className="mb-6">
            <span className="text-4xl font-bold">{price}</span>
            {period && <span className="text-gray-500 ml-2">per {period}</span>}
          </div>
        </div>
        
        <div className="flex-grow mb-6">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className={`mr-2 rounded-full p-0.5 ${
                  feature.included ? 'text-green-500 bg-green-50' : 'text-gray-300 bg-gray-50'
                }`}>
                  <Check size={16} />
                </span>
                <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button
          variant={highlight ? 'primary' : 'outline'}
          fullWidth
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;