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
  const baseInputClasses = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500';
  
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
      <div className={`flex items-center gap-3 ${className}`} style={style}>
        <input
          type="checkbox"
          id={label}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 text-primary-blue bg-gray-100 border-gray-300 rounded focus:ring-primary-blue focus:ring-2 transition-all duration-200"
        />
        <label htmlFor={label} className="text-sm font-medium text-gray-700 cursor-pointer">
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
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-blue hover:bg-primary-blue/5 transition-all duration-200 text-gray-600 hover:text-primary-blue ${className}`}
        style={style}
      >
        {children}
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