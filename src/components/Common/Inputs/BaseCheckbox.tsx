import React from "react";

interface BaseCheckboxProps {
  label?: string;
  name: string;
  checked: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const BaseCheckbox: React.FC<BaseCheckboxProps> = ({
  label,
  name,
  checked,
  required = false,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        id={name}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer"
      />

      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-500 cursor-pointer"
        >
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}
    </div>
  );
};
