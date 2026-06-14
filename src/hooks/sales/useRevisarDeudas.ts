import { useState } from "react";
import { revisarDeudasService } from "@/services/sales";

export function useRevisarDeudas() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [deudaInfo, setDeudaInfo] = useState<{
    tieneDeudasVencidas: boolean;
    mensaje: string;
    deudasVencidas: any[];
  } | null>(null);

  const checkDeudas = async (clienteId: number) => {
    setLoading(true);
    setSuccess(false);
    try {
      const data = await revisarDeudasService(clienteId);
      setDeudaInfo(data);
      setSuccess(true);
      setMessage(data.mensaje);
      return data;
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      const errMsg = backendMessage || "Error al revisar deudas";
      setMessage(errMsg);
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkDeudas,
    deudaInfo,
    loading,
    statusMessage,
    success,
    setDeudaInfo,
  };
}
