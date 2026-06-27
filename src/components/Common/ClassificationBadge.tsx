"use client";

interface ClassificationBadgeProps {
  text: string;
  className?: string;
  cleanText?: boolean;
}

export function ClassificationBadge({
  text,
  className = "",
  cleanText = false,
}: ClassificationBadgeProps) {
  if (!text) return null;
  
  const displayVal = cleanText
    ? text.replace(/_/g, " ")
    : text;

  return (
    <span
      className={`relative inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden text-[9px] font-black uppercase text-dark-2 tracking-wide select-none shadow-sm ${className}`}
    >
      {/* BORDER BG (Yellow with Blue) */}
      <span className="absolute inset-0 flex">
        <span className="w-1/2 h-full bg-yellow" />
        <span className="w-1/2 h-full bg-blue" />
      </span>
      {/* INNER CONTENT */}
      <span className="relative bg-white px-2 py-0.5 rounded-full block">
        {displayVal}
      </span>
    </span>
  );
}
