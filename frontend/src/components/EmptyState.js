import React from 'react';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  actionText = 'Thử lại',
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="w-16 h-16 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-warm-terracotta hover:bg-warm-rust focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-terracotta transition-colors duration-300"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
