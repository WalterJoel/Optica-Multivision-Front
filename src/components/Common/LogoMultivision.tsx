interface LogoMultivisionProps {
  size?: "sm" | "md";
  subtitle?: boolean;
  margin?: string;
}

export function LogoMultivision({
  size = "md",
  subtitle = true,
  margin,
}: LogoMultivisionProps) {
  const scales = {
    sm: {
      barW: "w-2",
      barH1: "h-4",
      barH2: "h-7",
      titleText: "text-[22px]",
      subText: "text-[8px]",
      subLine: "w-4",
      gap: "gap-1",
      margin: "mb-1.5",
    },
    md: {
      barW: "w-4",
      barH1: "h-8",
      barH2: "h-14",
      titleText: "text-[52px]",
      subText: "text-[12px]",
      subLine: "w-10",
      gap: "gap-2",
      margin: "mb-3",
    },
  };

  const s = scales[size];

  return (
    <div className={`flex flex-col items-center select-none ${margin}`}>
      {/* Animaciones optimizadas */}
      <style jsx>{`
        @keyframes subtlePulse {
          0%,
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
          50% {
            transform: scaleY(1.1);
            opacity: 0.8;
          }
        }

        @keyframes softBreath {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .animate-bar {
          animation: subtlePulse 3s ease-in-out infinite;
          transform-origin: bottom;
        }

        .animate-breath {
          animation: softBreath 4s ease-in-out infinite;
        }
      `}</style>

      {/* Isotipo */}
      <div className={`flex ${s.gap} items-end ${s.margin}`}>
        <div
          className={`${s.barW} ${s.barH2} bg-blue rounded-md shadow-lg animate-bar`}
        />
        <div
          className={`${s.barW} ${s.barH2} bg-yellow-dark rounded-md shadow-lg animate-bar`}
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Logotipo */}
      <div className="text-center animate-breath">
        <h1
          className={`${s.titleText} font-[1000] uppercase leading-none tracking-[-0.05em] text-dark`}
        >
          Multivision
        </h1>

        {/* Subtítulo condicional */}
        {subtitle && (
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className={`h-[2px] ${s.subLine} bg-dark/10`} />
            <span
              className={`${s.subText} font-black text-dark-3 tracking-[0.5em] uppercase opacity-50`}
            >
              Ópticas Premium
            </span>
            <div className={`h-[2px] ${s.subLine} bg-dark/10`} />
          </div>
        )}
      </div>
    </div>
  );
}
