import { useState } from "react";
import { obtenerMonturasExcelService } from "@/services/excel";
import { MonturaExcelRow } from "@/types/excel/monturas";

export function useMonturasExcel() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [monturasExcel, setMonturasExcel] = useState<MonturaExcelRow[]>([]);

  const obtenerMonturasExcel = async (sedeId: number) => {
    setLoading(true);
    setSuccess(false);

    try {
      const data = await obtenerMonturasExcelService(sedeId);

      setMonturasExcel(data);
      setSuccess(true);
      setMessage("Listado de monturas generado correctamente");

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
    obtenerMonturasExcel,
    monturasExcel,
    loading,
    statusMessage,
    success,
  };
}
