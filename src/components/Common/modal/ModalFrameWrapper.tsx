interface ModalFrameWrapperProps {
  children: React.ReactNode;
  variant?: "blue" | "red"; // Para que el ring cambie según el contexto
}

export function ModalFrameWrapper({
  children,
  variant = "blue",
}: ModalFrameWrapperProps) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div
        className={`w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 relative animate-in zoom-in duration-200 
          ring-8 ${variant === "blue" ? "ring-blue-light/30" : "ring-red-light/30"}`}
      >
        {children}
      </div>
    </div>
  );
}
