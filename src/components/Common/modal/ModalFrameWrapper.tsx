interface ModalFrameWrapperProps {
  children: React.ReactNode;
  variant?: "blue" | "red" | "yellow";
  size?: "xs" | "sm" | "md";
}

export function ModalFrameWrapper({
  children,
  variant = "blue",
  size = "sm",
}: ModalFrameWrapperProps) {
  const sizeClasses = {
    xs: "max-w-[280px]",
    sm: "max-w-sm",
    md: "max-w-md",
  };

  const ringClasses = {
    blue: "ring-blue-light/40",
    red: "ring-red-light/30",
    yellow: "ring-yellow-light/40",
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div
        className={`${sizeClasses[size]} ${ringClasses[variant]} w-full rounded-2xl bg-white shadow-2xl p-6 relative animate-in zoom-in duration-200 ring-8`}
      >
        {children}
      </div>
    </div>
  );
}
