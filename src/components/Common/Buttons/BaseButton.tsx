import React from "react";

type ButtonVariant = "primary" | "cancel" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
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
  size = "md",
  className = "",
}: ButtonProps) => {
  const baseStyles = `
    ${fullWidth ? "w-full" : "w-auto"}
    transition-all
    disabled:opacity-50
    disabled:cursor-not-allowed
    active:scale-95
    shrink-0
  `;

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-xs",
    md: "px-6 py-3 text-[13px]",
    lg: "px-8 py-5 text-[13px]",
  };

  const variants: Record<ButtonVariant, string> = {
    primary: `
      rounded-2xl
      font-black
      text-dark
      uppercase
      tracking-[0.2em]
      transition-all
      transform
      shadow-xl
      bg-yellow-dark
      hover:bg-yellow
      hover:shadow-yellow/20
    `,
    secondary: `
      rounded-xl
      font-black
      uppercase
      tracking-widest
      text-white
      bg-yellow
      hover:bg-yellow-dark
      transition-all
    `,
    cancel: `
      rounded-2xl
      bg-gray-1
      border border-gray-3
      text-gray-6
      uppercase
      font-bold
      hover:bg-gray-2
      hover:text-gray-7
      transition-all
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
};
