import React from 'react';

const colorSchemes = [
  {
    id: 'blue',
    name: '科技蓝',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bgColor: '#667eea',
    gradientColor: '#764ba2'
  },
  {
    id: 'purple',
    name: '优雅紫',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
    bgColor: '#8B5CF6',
    gradientColor: '#A855F7'
  },
  {
    id: 'green',
    name: '自然绿',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    bgColor: '#10B981',
    gradientColor: '#059669'
  },
  {
    id: 'orange',
    name: '活力橙',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    bgColor: '#F97316',
    gradientColor: '#EA580C'
  }
];

function ColorSchemeSelector({ selectedScheme, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {colorSchemes.map((scheme) => (
        <div 
          key={scheme.id}
          className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
            selectedScheme === scheme.id 
              ? 'border-primary-blue bg-primary-blue/5 shadow-md' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onSelect(scheme)}
        >
          <div 
            className="w-full h-12 rounded-md mb-3 shadow-sm" 
            style={{background: scheme.gradient}}
          />
          <div className="text-sm font-medium text-gray-800 text-center">{scheme.name}</div>
        </div>
      ))}
    </div>
  );
}

export default ColorSchemeSelector;