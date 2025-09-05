import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helpText?: string;
}

export default function Textarea({ label, helpText, className, ...props }: TextareaProps) {
  return (
    <label className="block">
      {label && <span className="label">{label}</span>}
      <textarea className={`input min-h-[120px] ${className ?? ''}`} {...props} />
      {helpText && <p className="help-text">{helpText}</p>}
    </label>
  );
}

