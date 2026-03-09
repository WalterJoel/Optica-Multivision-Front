import React from "react";

interface InputProps {
  label?: string;
  name: string;
  value: string | number;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  readOnly?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  pattern?: string;
  title?: string;
}

export const BaseInput = ({
  label,
  name,
  value,
  placeholder,
  type = "text",
  readOnly = false,
  required,
  min,
  max,
  step,
  onChange,
  onFocus,
  onBlur,
  pattern,
  title,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        readOnly={readOnly}
        required={required}
        placeholder={placeholder}
        min={type === "number" ? min : undefined}
        max={type === "number" ? max : undefined}
        step={type === "number" ? step : undefined}
        pattern={pattern}
        title={title}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full bg-white border border-gray-100 text-dark rounded-full py-2.5 px-5 
                   outline-none transition-all duration-200 text-sm shadow-sm shadow-gray-50/50
                   placeholder:text-gray-300
                   focus:border-blue focus:ring-4 focus:ring-blue/10"
      />
    </div>
  );
};
