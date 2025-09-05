import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helpText?: string;
  options: Option[];
}

export default function Select({ label, helpText, options, className, ...props }: SelectProps) {
  return (
    <label className="block">
      {label && <span className="label">{label}</span>}
      <select className={`input ${className ?? ''}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helpText && <p className="help-text">{helpText}</p>}
    </label>
  );
}

