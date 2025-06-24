import React from 'react';
import Card from './Card';
import Button from './Button';

interface AddOnCardProps {
  title: string;
  description: string;
  price: string;
  icon: React.ReactNode;
  category: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const AddOnCard: React.FC<AddOnCardProps> = ({
  title,
  description,
  price,
  icon,
  category,
  buttonText = 'Add to System',
  onButtonClick,
}) => {
  return (
    <Card className="h-full" bordered hoverEffect>
      <div className="flex flex-col h-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="p-2 bg-secondary-50 rounded-lg w-10 h-10 flex items-center justify-center text-secondary-600">
            {icon}
          </div>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700">
            {category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-lg">{price}</span>
          <Button variant="outline" size="sm" onClick={onButtonClick}>
            {buttonText}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AddOnCard;