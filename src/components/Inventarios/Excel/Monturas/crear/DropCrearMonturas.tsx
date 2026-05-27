"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { BaseButton } from "@/components/Common/Buttons";
import { useCrearMonturasExcel } from "@/hooks/excel";
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

import { descargarPlantillaExcelVacia } from "./FormatoExcel";
import { useSessionUser } from "@/hooks/session";

export const DropCrearMonturas = () => {
  const { sedeId } = useSessionUser();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);

  // 🔥 bloqueo descarga
  const [downloading, setDownloading] = useState(false);

  const { uploadExcelMonturas, loading, statusMessage, success } =
    useCrearMonturasExcel();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    noKeyboard: true,
    onDrop,
    maxSize: 15 * 1024 * 1024,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  const handleUpload = async () => {
    if (!file || loading) return;

    try {
      await uploadExcelMonturas(file);
      setFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  //Evitar doble click sobre descargar
  const handleDownloadTemplate = async () => {
    if (!sedeId || downloading) return;

    setDownloading(true);

    try {
      await descargarPlantillaExcelVacia(sedeId);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

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

  return (
    <div className="bg-white border border-gray-100 rounded-[28px] shadow-testimonial p-5 sm:p-6 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-light/10 flex items-center justify-center shrink-0">
          <FileSpreadsheet className="text-blue-light" size={22} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[3px] text-blue-light font-semibold">
            Plantilla
          </p>
          <h2 className="text-base font-bold text-dark">Crear Monturas</h2>
        </div>

        {/* BOTÓN DESCARGA */}
        <BaseButton
          fullWidth={false}
          onClick={handleDownloadTemplate}
          disabled={downloading}
          className="min-w-[120px] flex items-center justify-center gap-2"
        >
          {downloading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}

          {downloading ? "Descargando..." : "Descargar"}
        </BaseButton>
      </div>

      {/* DROPZONE */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-3xl transition-all duration-200
          cursor-pointer py-10 px-6 flex flex-col items-center justify-center
          text-center overflow-hidden flex-1
          ${
            isDragActive
              ? "border-blue-light bg-blue-light/5"
              : "border-gray-200 hover:border-blue-light hover:bg-blue-light/5"
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-light/5 via-transparent to-yellow-dark/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full bg-white shadow-testimonial border border-blue-light/10 flex items-center justify-center mx-auto mb-3">
            <UploadCloud size={28} className="text-blue-light" />
          </div>

          <h3 className="text-base font-bold text-dark">
            Arrastra tu Excel aquí
          </h3>

          <p className="text-gray-500 mt-1 text-sm">
            o haz click para seleccionar archivo
          </p>

          <p className="text-xs text-gray-400 mt-3">
            Compatible con .xlsx y .xls
          </p>
        </div>
      </div>

      {/* FILE INFO */}
      {file && (
        <div
          className={`
            mt-4 rounded-2xl p-3 flex items-center gap-3 border
            ${
              success
                ? "border-green-200 bg-green-50"
                : "border-blue-100 bg-blue-50"
            }
          `}
        >
          <CheckCircle2
            className={success ? "text-green-600" : "text-blue-light"}
            size={20}
          />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-dark truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {statusMessage || "Archivo listo para importar"}
            </p>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end mt-5">
        <BaseButton
          onClick={handleUpload}
          disabled={!file || loading}
          className="min-w-[180px] flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Cargando..." : "Cargar Excel"}
        </BaseButton>
      </div>

      <LoadingModal isOpen={loading} />

      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};
