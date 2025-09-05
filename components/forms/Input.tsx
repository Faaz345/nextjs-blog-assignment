import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
}

export default function Input({ label, helpText, leftIcon, className, ...props }: InputProps) {
  return (
    <label className="block">
      {label && <span className="label">{label}</span>}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {leftIcon}
          </span>
        )}
        <input className={`input ${leftIcon ? 'pl-9' : ''} ${className ?? ''}`} {...props} />
      </div>
      {helpText && <p className="help-text">{helpText}</p>}
    </label>
  );
}

