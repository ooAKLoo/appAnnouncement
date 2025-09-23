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
    <div className="color-scheme-grid">
      {colorSchemes.map((scheme) => (
        <div 
          key={scheme.id}
          className={`color-scheme-item ${selectedScheme === scheme.id ? 'active' : ''}`}
          data-scheme={scheme.id}
          onClick={() => onSelect(scheme)}
        >
          <div 
            className="color-scheme-preview" 
            style={{background: scheme.gradient}}
          />
          <div className="color-scheme-name">{scheme.name}</div>
        </div>
      ))}
    </div>
  );
}

export default ColorSchemeSelector;