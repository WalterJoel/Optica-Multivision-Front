import React from "react";

type ButtonIconVariant = "danger" | "success" | "primary" | "neutral";

interface ButtonIconProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonIconVariant;
  className?: string;
  center?: boolean; // Controla el centrado automático con mx-auto
}

export const BaseButtonIcon = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  variant = "neutral",
  className = "",
  center = true, // Por defecto centrado para tablas
}: ButtonIconProps) => {
  const baseStyles = `
    flex
    items-center
    justify-center
    rounded-full
    transition-all
    duration-200
    disabled:opacity-50
    disabled:cursor-not-allowed
    w-10
    h-10
    flex-shrink-0
    ${center ? "mx-auto" : ""}
  `;

  const variants: Record<ButtonIconVariant, string> = {
    danger: "bg-[#FF6E70] text-white hover:bg-[#F06062] shadow-sm",
    success: "bg-[#22C55E] text-white hover:bg-[#16A34A] shadow-sm",
    primary: "bg-blue text-white hover:brightness-110 shadow-sm",
    neutral:
      "bg-gray-1 border border-gray-3 text-gray-6 hover:bg-gray-2 hover:text-gray-7",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? <span className="text-xs">...</span> : children}
    </button>
  );
};
