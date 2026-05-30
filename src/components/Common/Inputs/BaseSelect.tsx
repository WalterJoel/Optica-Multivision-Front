import React from "react";

export interface IOptionSelect {
  label: string;
  value: string | number;
}

interface SelectProps {
  label?: string;
  name?: string;
  value: string | number;
  options: IOptionSelect[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

export const BaseSelect = ({
  label,
  name,
  value,
  options,
  placeholder = "Seleccionar...",
  disabled = false,
  required = false,
  onChange,
  onBlur,
  onFocus,
}: SelectProps) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <select
          id={name}
          name={name}
          value={value}
          disabled={disabled}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          style={{ backgroundColor: "white" }}
          className="w-full appearance-none rounded-2xl border border-gray-3 bg-white p-4.5 pr-12 outline-none focus:border-blue focus:ring-4 focus:ring-blue/5 transition-all duration-300 text-dark shadow-sm"
        >
          {/* <option value="" disabled>
            {placeholder}
          </option> */}

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
