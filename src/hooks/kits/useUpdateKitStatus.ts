import { useState } from "react";
import { updateKitStatusService } from "@/services/kits";

export function useUpdateKitStatus() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const updateKitStatus = async (id: number, activo: boolean) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateKitStatusService(id, activo);
      setSuccess(true);
      setMessage(
        activo
          ? "Kit activado correctamente"
          : "Kit desactivado correctamente"
      );
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al actualizar estado del kit: " + backendMessage
          : "Error al actualizar estado del kit",
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateKitStatus, loading, statusMessage, success };
}
