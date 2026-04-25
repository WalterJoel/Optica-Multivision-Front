import React from "react";

interface InputProps {
  label?: string;
  name?: string;
  value: string | number;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  disabled = false,
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
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
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
        className="w-full rounded-2xl border border-gray-3 bg-white p-4.5 outline-none focus:border-blue focus:ring-4 focus:ring-blue/5 transition-all duration-300 placeholder:text-gray-4 text-dark shadow-sm"
      />
    </div>
  );
};
