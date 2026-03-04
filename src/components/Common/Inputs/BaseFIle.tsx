import React, { useState, useEffect } from "react";

interface BaseFileProps {
  label?: string;
  name: string;
  accept?: string;
  required?: boolean;
  onChange: (file: File | null, previewUrl?: string) => void;
  currentUrl?: string;
  className?: string;
}

export const BaseFile: React.FC<BaseFileProps> = ({
  label,
  name,
  accept = "image/*",
  required = false,
  onChange,
  currentUrl,
  className = "",
}) => {
  const [preview, setPreview] = useState<string | undefined>(currentUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file, url);
    } else {
      setPreview(undefined);
      onChange(null);
    }
  };

  const removeFile = () => {
    setPreview(undefined);
    onChange(null);
  };

  useEffect(() => {
    return () => {
      if (preview && !currentUrl) URL.revokeObjectURL(preview);
    };
  }, [preview, currentUrl]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-600">{label}</label>
      )}

      <div
        className="relative w-full h-40 border border-gray-3
          bg-gray-1 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500"
      >
        <input
          type="file"
          name={name}
          accept={accept}
          required={required}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </>
        ) : (
          <span className="flex items-center justify-center h-full text-gray-400 text-sm">
            Haz clic para subir imagen
          </span>
        )}
      </div>
    </div>
  );
};
