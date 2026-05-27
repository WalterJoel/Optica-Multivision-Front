import { useState } from "react";

import { editarMonturasExcelService } from "@/services/excel";

export function useEditarMonturasExcel() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const uploadExcelMonturas = async (file: File) => {
    setLoading(true);

    setSuccess(false);

    setStatusMessage("");

    try {
      const response = await editarMonturasExcelService(file);

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
    uploadExcelMonturas,

    loading,

    statusMessage,

    success,
  };
}
