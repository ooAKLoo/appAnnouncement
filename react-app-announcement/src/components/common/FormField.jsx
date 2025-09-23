import React from 'react';

function FormField({ 
  type = 'text', 
  label, 
  value, 
  onChange, 
  placeholder, 
  maxLength,
  rows,
  style,
  className = '',
  children 
}) {
  const baseInputClasses = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue/50 transition-all duration-300 text-gray-800 placeholder-gray-400 bg-white/80 backdrop-blur-sm hover:border-gray-300';
  
  if (type === 'textarea') {
    return (
      <textarea
        className={`${baseInputClasses} resize-none ${className}`}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows || 3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={style}
      />
    );
  }

  if (type === 'checkbox') {
    return (
      <div className={`flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50/60 transition-all duration-300 border border-transparent hover:border-gray-100 ${className}`} style={style}>
        <div className="relative">
          <input
            type="checkbox"
            id={label}
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <div 
            className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 cursor-pointer flex items-center justify-center ${
              value 
                ? 'bg-gradient-to-br from-primary-blue to-primary-blue/90 border-primary-blue shadow-sm' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onChange(!value)}
          >
            {value && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <label 
          htmlFor={label} 
          className="text-sm font-medium text-gray-700 cursor-pointer flex-1 select-none"
          onClick={() => onChange(!value)}
        >
          {label}
        </label>
      </div>
    );
  }

  if (type === 'color') {
    return (
      <div className={`flex items-center gap-3 ${className}`} style={style}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors duration-200"
        />
        <div className="text-sm font-medium text-gray-700">{label}</div>
      </div>
    );
  }

  if (type === 'upload') {
    return (
      <button
        type="button"
        onClick={onChange}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-blue hover:bg-primary-blue/5 transition-all duration-300 text-gray-600 hover:text-primary-blue hover:shadow-sm ${className}`}
        style={style}
      >
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          {children}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  }

  return (
    <input
      type={type}
      className={`${baseInputClasses} ${className}`}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
    />
  );
}

export default FormField;