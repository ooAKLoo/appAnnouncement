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
  className,
  children 
}) {
  const baseClassName = 'config-input';
  const fieldClassName = className ? `${baseClassName} ${className}` : baseClassName;

  if (type === 'textarea') {
    return (
      <textarea
        className={fieldClassName}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={style}
      />
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="config-checkbox-row" style={style}>
        <input
          type="checkbox"
          id={label}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={label} className="config-checkbox-label">
          {label}
        </label>
      </div>
    );
  }

  if (type === 'color') {
    return (
      <div className="config-color-row" style={style}>
        <input
          type="color"
          className="config-color-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="config-color-label">{label}</div>
      </div>
    );
  }

  if (type === 'upload') {
    return (
      <div
        className="config-upload-btn"
        onClick={onChange}
        style={style}
      >
        {children}
        {label}
      </div>
    );
  }

  return (
    <input
      type={type}
      className={fieldClassName}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
    />
  );
}

export default FormField;