import { useState } from "react";
import { validarCajaAbiertaService } from "@/services/caja";
import { ICaja } from "@/types/caja";

export function useValidarCajaAbierta() {
  const [caja, setCaja] = useState<ICaja | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState("");

  const existe = caja?.estado === "ABIERTA";

  const validarCajaAbierta = async (sedeId: number) => {
    setLoading(true);
    setCaja(null);

    try {
      const res = await validarCajaAbiertaService(sedeId);

      setCaja(res.caja);

      setMessage(res.caja ? "Caja abierta" : "No hay caja abierta");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error al validar caja");
    } finally {
      setLoading(false);
    }
  };

  return {
    validarCajaAbierta,
    caja,
    existe,
    loading,
    statusMessage,
  };
}
