"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { BaseButton } from "@/components/Common/Buttons";
import { useCrearMonturasExcel } from "@/hooks/excel";
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

import { useSessionUser } from "@/hooks/session";
import { useUploadFile } from "@/hooks/upload-file/useUploadFile";

interface BaseFileProps {
  label?: string;
  name?: string;
  onChange?: (file: File | null) => void;
  currentUrl?: string;
  triggerUpload?: boolean;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (err: any) => void;
  value?: File | null;
}

export const BaseFile = ({
  label,
  name,
  onChange,
  currentUrl,
  triggerUpload = false,
  onUploadSuccess,
  onUploadError,
  value,
}: BaseFileProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Hooks
  const { uploadFile, loading, statusMessage, success } = useUploadFile();

  // Functions
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    if (selectedFile.size <= 1 * 1024 * 1024) {
      setErrorMessage("");
      if (onChange) onChange(selectedFile);
    } else {
      setErrorMessage("El archivo supera el límite de 1 MB");
      setTypeModal(STATUS_MODAL.ERROR_MODAL);
      setOpenModal(true);
      if (onChange) onChange(null);
    }
  }, [onChange]);

  // Preview management & Reset sync
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  // Trigger S3 upload upon form submit coordination
  useEffect(() => {
    if (triggerUpload && value && !loading) {
      const doUpload = async () => {
        try {
          const url = await uploadFile(value);
          if (onUploadSuccess) onUploadSuccess(url);
        } catch (error) {
          if (onUploadError) onUploadError(error);
        }
      };
      doUpload();
    }
  }, [triggerUpload, value, loading, uploadFile, onUploadSuccess, onUploadError]);

  // Handle status modals for upload
  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    noKeyboard: true,
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
  });

  return (
    <div className="p-5 sm:p-6 h-full flex flex-col">
      {label && (
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {label}
        </label>
      )}

      {/* DROPZONE + PREVIEW */}
      <div className="flex gap-4 items-stretch">

        {/* DROPZONE */}
        <div
          {...getRootProps()}
          className={`
              relative border-2 border-dashed rounded-3xl transition-all duration-200
              cursor-pointer py-10 px-6 flex flex-col items-center justify-center
              text-center overflow-hidden flex-1
              ${isDragActive
              ? "border-blue-light bg-blue-light/5"
              : "border-gray-200 hover:border-blue-light hover:bg-blue-light/5"
            }
            `}
        >
          <input {...getInputProps()} name={name} />

          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-light/5 via-transparent to-yellow-dark/5 pointer-events-none" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full bg-white shadow-testimonial border border-blue-light/10 flex items-center justify-center mx-auto mb-3">
              <UploadCloud size={28} className="text-blue-light" />
            </div>

            <h3 className="text-base font-bold text-dark">
              Arrastra tu Imagen aquí
            </h3>

            <p className="text-gray-500 mt-1 text-sm">
              o haz click para seleccionar archivo
            </p>

            <p className="text-xs text-gray-400 mt-3">
              Compatible con JPG, PNG y WEBP (Máximo 1 MB)
            </p>
          </div>
        </div>

        {/* IMAGE PREVIEW */}
        <div className="w-40 shrink-0 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
          {(preview || currentUrl) ? (
            <img
              src={preview || currentUrl}
              alt="Vista previa"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <ImageIcon size={40} />
              <p className="text-xs">Sin imagen</p>
            </div>
          )}
        </div>

      </div>

      {/* FILE INFO */}
      {(value || currentUrl) && (
        <div
          className={`
              mt-4 rounded-2xl p-3 flex items-center gap-3 border
              ${value && value.size > 1 * 1024 * 1024
              ? "border-red-200 bg-red-50"
              : success
                ? "border-green-200 bg-green-50"
                : "border-blue-100 bg-blue-50"
            }
            `}
        >
          <CheckCircle2
            className={
              value && value.size > 1 * 1024 * 1024
                ? "text-red-500"
                : success
                  ? "text-green-600"
                  : "text-blue-light"
            }
            size={20}
          />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-dark truncate">
              {value ? value.name : "Imagen cargada"}
            </p>
            <p className={`text-xs ${value && value.size > 1 * 1024 * 1024 ? "text-red-500 font-medium" : "text-gray-500"}`}>
              {value && value.size > 1 * 1024 * 1024
                ? "El archivo supera el límite de 1 MB"
                : statusMessage || "Archivo listo"}
            </p>
          </div>
        </div>
      )}

      <LoadingModal isOpen={loading} />

      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage || errorMessage}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};
