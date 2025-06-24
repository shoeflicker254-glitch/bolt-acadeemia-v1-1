import React from 'react';
import Card from './Card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  className = '',
}) => {
  return (
    <Card className={`h-full ${className}`} hoverEffect>
      <div className="flex flex-col h-full">
        <div className="p-3 bg-primary-50 rounded-lg w-12 h-12 flex items-center justify-center text-primary-600 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
      </div>
    </Card>
  );
};

export default FeatureCard;