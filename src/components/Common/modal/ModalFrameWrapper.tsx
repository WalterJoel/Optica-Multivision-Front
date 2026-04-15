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
    xs: "max-w-[300px]",
    sm: "max-w-sm",
    md: "max-w-lg",
  };

  // Definimos los pares de colores sólidos según la variante
  const borderPairs = {
    blue: { left: "bg-blue", right: "bg-yellow" },
    red: { left: "bg-red-600", right: "bg-red-400" },
    yellow: { left: "bg-yellow", right: "bg-blue" },
  };

  const colors = borderPairs[variant];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-500">
      {/* CONTENEDOR DE BORDE DUAL (Sólido, sin gradiente) */}
      <div
        className={`
          ${sizeClasses[size]} 
          w-full rounded-[2.5rem] 
          relative overflow-hidden
          p-[2px] 
          shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]
          animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
        `}
      >
        {/* Fondo del borde: Mitad y Mitad */}
        <div className="absolute inset-0 flex">
          <div className={`h-full w-1/2 ${colors.left}`} />
          <div className={`h-full w-1/2 ${colors.right}`} />
        </div>

        {/* El cuerpo del modal (Blanco puro) */}
        <div className="bg-white rounded-[2.4rem] relative overflow-hidden h-full w-full">
          {/* Sutil sombreado interno en el borde superior para dar relieve */}
          <div className="absolute top-0 left-0 right-0 h-px bg-white/20 z-20" />

          {/* Iluminación de esquina (Glow blanco, no de color) 
              Esto hace que el blanco se vea 'limpio' y premium */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-slate-100 rounded-full blur-3xl pointer-events-none opacity-50" />

          {/* Content */}
          <div className="p-8 relative z-10">{children}</div>

          {/* Badge de marca minimalista en la esquina */}
          <div className="absolute bottom-6 right-8 select-none">
            <div className="flex gap-1 items-center">
              <div className="w-1 h-3 bg-blue rounded-full" />
              <div className="w-1 h-3 bg-yellow rounded-full" />
              <span className="ml-1 text-[10px] font-black text-slate-200 tracking-tighter uppercase">
                Multivision
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
