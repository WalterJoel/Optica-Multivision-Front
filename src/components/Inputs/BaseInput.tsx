import React from "react";

interface InputProps {
  label?: string;
  name: string;
  value: string | number;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  readOnly?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BaseInput = ({
  label,
  name,
  value,
  placeholder,
  type = "text",
  readOnly = false,
  required,
  onChange,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-600">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5
                   w-full py-2.5 px-5 outline-none duration-200
                   focus:border-transparent focus:shadow-input
                   focus:ring-2 focus:ring-blue/20"
      />
    </div>
  );
};
