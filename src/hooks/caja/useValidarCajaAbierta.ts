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

    try {
      const res = await validarCajaAbiertaService(sedeId);

      const data = res?.caja || null;

      setCaja(data);

      setMessage(
        data?.estado === "ABIERTA" ? "Caja abierta" : "No hay caja abierta",
      );

      return data;
    } catch (err: any) {
      setCaja(null);

      const msg = err.response?.data?.message || "Error al validar caja";

      setMessage(msg);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔥 helper opcional para refrescar sin sedeId externo
  const refresh = async (sedeId?: number) => {
    if (!sedeId) return null;
    return await validarCajaAbierta(sedeId);
  };

  return {
    validarCajaAbierta,
    refresh,
    caja,
    existe,
    loading,
    statusMessage,
  };
}
