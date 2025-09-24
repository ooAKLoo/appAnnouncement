import React from 'react';

const gradientSchemes = [
  {
    id: 'blue',
    name: '科技蓝',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bgColor: '#667eea',
    gradientColor: '#764ba2'
  },
  {
    id: 'purple',
    name: '优雅紫',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
    bgColor: '#8B5CF6',
    gradientColor: '#A855F7'
  },
  {
    id: 'green',
    name: '自然绿',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    bgColor: '#10B981',
    gradientColor: '#059669'
  },
  {
    id: 'orange',
    name: '活力橙',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    bgColor: '#F97316',
    gradientColor: '#EA580C'
  }
];

const solidSchemes = [
  {
    id: 'blue-solid',
    name: '纯净蓝',
    type: 'solid',
    bgColor: '#3B82F6',
    gradientColor: '#3B82F6'
  },
  {
    id: 'purple-solid',
    name: '典雅紫',
    type: 'solid',
    bgColor: '#8B5CF6',
    gradientColor: '#8B5CF6'
  },
  {
    id: 'green-solid',
    name: '清新绿',
    type: 'solid',
    bgColor: '#10B981',
    gradientColor: '#10B981'
  },
  {
    id: 'orange-solid',
    name: '温暖橙',
    type: 'solid',
    bgColor: '#F97316',
    gradientColor: '#F97316'
  },
  {
    id: 'red-solid',
    name: '热情红',
    type: 'solid',
    bgColor: '#EF4444',
    gradientColor: '#EF4444'
  },
  {
    id: 'gray-solid',
    name: '高级灰',
    type: 'solid',
    bgColor: '#6B7280',
    gradientColor: '#6B7280'
  }
];

function ColorSchemeSelector({ selectedScheme, colorMode = 'gradient', onSelect }) {
  const schemes = colorMode === 'gradient' ? gradientSchemes : solidSchemes;
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {schemes.map((scheme) => (
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
            style={{
              background: scheme.type === 'gradient' ? scheme.gradient : scheme.bgColor
            }}
          />
          <div className="text-sm font-medium text-gray-800 text-center">{scheme.name}</div>
        </div>
      ))}
    </div>
  );
}

export default ColorSchemeSelector;