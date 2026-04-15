import React from "react";

type ButtonVariant = "primary" | "cancel" | "secondary";

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
      transition-all
      duration-200
      disabled:opacity-50
      disabled:cursor-not-allowed
      active:scale-95
      shrink-0
  `;

  const variants: Record<ButtonVariant, string> = {
    primary: `
      bg-blue
      hover:bg-blue-dark
      text-white
      px-8
      py-4
      font-black
      text-xs
      uppercase
      tracking-widest
      shadow-md
      shadow-blue/20
    `,
    secondary: `
      bg-yellow
      hover:bg-yellow-dark
      text-white
      px-8
      py-4
      font-black
      text-xs
      uppercase
      tracking-widest
      shadow-md
      shadow-blue/20
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
