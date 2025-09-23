import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Rocket, Sparkles, PartyPopper } from 'lucide-react';
import { themes } from '../../data/templateConfig';

const themeList = Object.values(themes);

// Icon mapping
const iconMap = {
  Rocket,
  Sparkles,
  PartyPopper
};

function ThemeSelector({ selectedTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentTheme = themeList.find(theme => theme.id === selectedTheme) || themeList[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleThemeSelect = (theme) => {
    onThemeChange(theme.id);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          {iconMap[currentTheme.icon] && React.createElement(iconMap[currentTheme.icon], { size: 20, className: "text-gray-600" })}
          <div className="text-left">
            <div className="font-medium text-gray-900">{currentTheme.name}</div>
            <div className="text-xs text-gray-500">{currentTheme.description}</div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          {themeList.map(theme => {
            const IconComponent = iconMap[theme.icon];
            
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  theme.id === selectedTheme ? 'bg-primary-blue/5' : ''
                }`}
              >
                {IconComponent && <IconComponent size={20} className="text-gray-600" />}
                <div className="text-left flex-1">
                  <div className="font-medium text-gray-900">{theme.name}</div>
                  <div className="text-xs text-gray-500">{theme.description}</div>
                </div>
                {theme.id === selectedTheme && (
                  <svg className="w-5 h-5 text-primary-blue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;