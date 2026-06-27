"use client";

import React, { useState } from "react";
import { ImageZoomModal } from "./ImageZoomModal";

interface ImageWithZoomProps {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackIcon?: React.ReactNode;
}

export function ImageWithZoom({
  src,
  alt,
  className = "w-full h-full",
  imgClassName = "w-full h-full object-contain",
  fallbackIcon = "📷",
}: ImageWithZoomProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`relative cursor-zoom-in select-none hover:opacity-90 transition duration-200 ${className}`}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className={imgClassName}
            style={{ pointerEvents: "none" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {fallbackIcon}
          </div>
        )}
      </div>

      <ImageZoomModal
        src={src || ""}
        alt={alt}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        fallbackIcon={fallbackIcon}
      />
    </>
  );
}
