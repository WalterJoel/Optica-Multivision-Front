import { useState } from "react";

import { getAllKitsService } from "@/services/kits";
import { IKit } from "@/types/kits";

export function useKits() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [kits, setKits] = useState<IKit[]>([]);

  const getAllKits = async (sedeId?: number) => {
    setLoading(true);
    setSuccess(false);

    try {
      const data = await getAllKitsService(sedeId);
      setKits(data);
      setSuccess(true);
      setMessage("listado de Kits correto");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al listar kits: " + backendMessage
          : "Error al listar kits",
      );
    } finally {
      setLoading(false);
    }
  };

  return { getAllKits, kits, loading, statusMessage, success };
}
