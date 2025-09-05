import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  values: string[];
  placeholder?: string;
  onChange: (values: string[]) => void;
}

export default function MultiSelect({ label, options, values, onChange, placeholder = 'Select…' }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleValue = (v: string) => {
    const set = new Set(values);
    if (set.has(v)) set.delete(v); else set.add(v);
    onChange(Array.from(set));
  };

  const selectedLabels = values
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean)
    .join(', ');

  return (
    <div className="w-full" ref={ref}>
      {label && <div className="label">{label}</div>}
      <button
        type="button"
        className="input flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={clsx('truncate', selectedLabels ? 'text-gray-900' : 'text-gray-500')}>
          {selectedLabels || placeholder}
        </span>
        <svg className={clsx('ml-2 h-4 w-4 text-gray-500 transform transition-transform', open && 'rotate-180')} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-5-5A1 1 0 015.707 5.293L10 9.586l4.293-4.293A1 1 0 1115.707 6.707l-5 5A1 1 0 0110 12z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="relative">
          <div className="absolute z-20 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
            {options.length === 0 && (
              <div className="p-3 text-sm text-gray-500">No options</div>
            )}
            {options.map((opt) => {
              const checked = values.includes(opt.value);
              return (
                <label key={opt.value} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={checked}
                    onChange={() => toggleValue(opt.value)}
                  />
                  <span className="truncate">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

