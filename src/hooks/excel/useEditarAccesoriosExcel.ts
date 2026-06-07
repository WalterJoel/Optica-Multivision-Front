import { useState } from "react";
import { editarAccesoriosExcelService } from "@/services/excel";

export function useEditarAccesoriosExcel() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const uploadExcelAccesorios = async (file: File) => {
    setLoading(true);
    setSuccess(false);
    setStatusMessage("");

    try {
      const response = await editarAccesoriosExcelService(file);

      setSuccess(true);
      setStatusMessage(
        `Excel importado correctamente (${response?.total ?? 0} registros)`,
      );

      return response;
    } catch (err: any) {
      console.error(err);

      const backendMessage = err?.response?.data?.message;

      setStatusMessage(
        backendMessage
          ? `Error al importar Excel: ${backendMessage}`
          : "Error al importar Excel",
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadExcelAccesorios,
    loading,
    statusMessage,
    success,
  };
}
