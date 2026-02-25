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
  pattern,
  title,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-600">
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
        required={required}
        placeholder={placeholder}
        min={type === "number" ? min : undefined}
        max={type === "number" ? max : undefined}
        step={type === "number" ? step : undefined}
        pattern={pattern} // Patron de validacion
        title={title} // Mensaje de error que muestra el navegador
        onChange={onChange}
        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5
                   w-full py-2.5 px-5 outline-none duration-200
                   focus:border-transparent focus:shadow-input
                   focus:ring-2 focus:ring-blue/20"
      />
    </div>
  );
};
