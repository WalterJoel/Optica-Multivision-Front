import { useState } from "react";
import { ICreateCaja } from "@/types/caja";
import { createCajaService } from "@/services/caja";

export function useCreateCaja() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const addCaja = async (payload: ICreateCaja) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      await createCajaService(payload);
      setSuccess(true);
      setMessage("Caja creada correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al registrar caja: " + backendMessage
          : "Error al registrar caja",
      );
    } finally {
      setLoading(false);
    }
  };

  return { addCaja, loading, statusMessage, success };
}
