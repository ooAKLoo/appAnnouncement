import React from 'react';
import { Minus, Pencil, Zap, Clock } from 'lucide-react';
import { getAllStyles } from '../../data/styleConfig';

// Icon mapping
const iconMap = {
  Minus,
  Pencil,
  Zap,
  Clock
};

function StyleSelector({ selectedStyle, onStyleChange }) {
  const styles = getAllStyles();

  return (
    <div className="grid grid-cols-2 gap-3">
      {styles.map((style) => {
        const IconComponent = iconMap[style.icon];
        
        return (
          <button
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            className={`p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md text-left ${
              selectedStyle === style.id 
                ? 'border-primary-blue bg-primary-blue/5 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {IconComponent && <IconComponent size={20} className="text-gray-600" />}
              <div className="font-medium text-gray-800">{style.name}</div>
            </div>
            <div className="text-xs text-gray-600">{style.description}</div>
          </button>
        );
      })}
    </div>
  );
}

export default StyleSelector;