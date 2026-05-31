import { useState, useCallback } from "react";
import { getAllClientsService } from "@/services/clients";
import { IClient } from "@/types/clients";

export function useClients() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [clientes, setClientes] = useState<IClient[]>([]);

  const loadClientes = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await getAllClientsService();
      setClientes(data || []);
      setMessage("Clientes obtenidos correctamente");
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? "Error al obtener clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loadClientes,
    clientes,
    loading,
    statusMessage,
  };
}
