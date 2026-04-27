import React from "react";

interface BaseTextareaProps {
  label?: string;
  name?: string;
  value: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export const BaseTarea: React.FC<BaseTextareaProps> = ({
  label,
  name,
  value,
  placeholder,
  rows = 3,
  required = false,
  minLength,
  maxLength,
  disabled = false,
  readOnly = false,
  onChange,
  onBlur,
  onFocus,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className="
          w-full rounded-2xl border border-gray-3 bg-white
          p-4.5 outline-none
          focus:border-blue focus:ring-4 focus:ring-blue/5
          transition-all duration-300
          placeholder:text-gray-4 text-dark shadow-sm
          disabled:bg-gray-100 disabled:cursor-not-allowed
        "
      />
    </div>
  );
};
