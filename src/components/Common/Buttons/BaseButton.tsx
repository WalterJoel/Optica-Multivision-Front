import React from "react";

type ButtonVariant = "primary" | "cancel";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  className?: string;
}

export const BaseButton = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = true,
  variant = "primary",
  className = "",
}: ButtonProps) => {
  const baseStyles = `
    ${fullWidth ? "w-full" : ""}
    rounded-xl
    transition
    duration-200
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;

  const variants: Record<ButtonVariant, string> = {
    primary: `
      bg-blue
      py-3
      text-white
      font-bold
      shadow-md
      hover:brightness-110
    `,
    cancel: `
        w-full py-[9px] rounded-xl 
        bg-gray-1 border border-gray-3 
        text-gray-6 font-medium 
        hover:bg-gray-2 hover:text-gray-7 transition-all
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
};
