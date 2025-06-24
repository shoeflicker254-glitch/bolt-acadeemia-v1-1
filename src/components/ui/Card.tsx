import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  elevated?: boolean;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  bordered = false,
  elevated = false,
  hoverEffect = false,
}) => {
  const baseClasses = 'bg-white rounded-xl p-6 transition-all duration-200';
  const borderClasses = bordered ? 'border border-gray-200' : '';
  const elevationClasses = elevated ? 'shadow-md' : 'shadow-sm';
  const hoverClasses = hoverEffect ? 'hover:shadow-md hover:translate-y-[-2px]' : '';
  
  return (
    <div className={`${baseClasses} ${borderClasses} ${elevationClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;