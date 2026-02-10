"use client";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">
      <img
        src="/lente.png"
        className="w-20 h-20 animate-lens
        drop-shadow-[0_0_20px_rgba(56,189,248,0.7)]"
      />
      <span className="mt-4 text-sky-400 tracking-widest text-sm">
        cargando...
      </span>
    </div>
  );
}
