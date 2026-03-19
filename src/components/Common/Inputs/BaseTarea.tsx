import React from "react";

interface BaseTextareaProps {
  label?: string;
  name: string;
  value: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        onChange={onChange}
        className="w-full
          rounded-md
          border border-gray-3
          bg-gray-1
          placeholder:text-gray-400
          px-4 py-3
          outline-none
          duration-200
          focus:border-transparent
          focus:shadow-input
          focus:ring-2
          focus:ring-blue-light
          resize-none"
      />
    </div>
  );
};
