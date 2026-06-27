"use client";

import React, { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { ModalFrameWrapper } from "./modal/ModalFrameWrapper";

interface ImageZoomModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoomModal({ src, alt, isOpen, onClose }: ImageZoomModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset scale and position when opening/closing modal
  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => {
      const next = Math.max(prev - 0.25, 1);
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <ModalFrameWrapper variant="blue" size="md" onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* Header Toolbar inside Modal */}
        <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">
          <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider truncate max-w-[50%]">
            {alt}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={scale === 1}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-50 text-slate-700 dark:text-slate-300 transition"
              title="Alejar"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-[10px] font-bold text-slate-500 w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scale === 3}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-50 text-slate-700 dark:text-slate-300 transition"
              title="Acercar"
            >
              <ZoomIn size={14} />
            </button>
            {scale > 1 && (
              <button
                onClick={handleReset}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition"
                title="Restablecer"
              >
                Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition ml-1"
              title="Cerrar"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Viewport for image inside frame */}
        <div
          className={`relative w-full aspect-square max-h-[350px] bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden flex items-center justify-center p-6 border border-gray-100 dark:border-slate-800/80 ${
            scale > 1 ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={src}
            alt={alt}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              maxHeight: "280px",
            }}
            className="object-contain pointer-events-none select-none max-w-full rounded-xl"
          />
        </div>
      </div>
    </ModalFrameWrapper>
  );
}
