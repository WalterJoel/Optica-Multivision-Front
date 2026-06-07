import { useState } from "react";
import { obtenerAccesoriosExcelService } from "@/services/excel";
import { AccesorioExcelRow } from "@/types/excel/accesorios";

export function useAccesoriosExcel() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [accesoriosExcel, setAccesoriosExcel] = useState<AccesorioExcelRow[]>([]);

  const obtenerAccesoriosExcel = async (sedeId: number) => {
    setLoading(true);
    setSuccess(false);

    try {
      const data = await obtenerAccesoriosExcelService(sedeId);

      setAccesoriosExcel(data);
      setSuccess(true);
      setMessage("Listado de accesorios generado correctamente");

      return data;
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;

      setMessage(
        backendMessage
          ? "Error al generar Excel: " + backendMessage
          : "Error al generar Excel",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    obtenerAccesoriosExcel,
    accesoriosExcel,
    loading,
    statusMessage,
    success,
  };
}
