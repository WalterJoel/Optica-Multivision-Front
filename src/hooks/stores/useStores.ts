"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllStoresService } from "@/services/stores";
import { IStore } from "@/types/stores";

export function useStores() {
  const [loading, setLoading] = useState(true);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [sedes, setSedes] = useState<IStore[]>([]);

  const getAllStores = useCallback(async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const data = await getAllStoresService();
      setSedes(data);
      setSuccess(true);
      setMessage("Sedes obtenidas correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al obtener sedes: " + backendMessage
          : "Error al obtener sedes",
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllStores();
  }, [getAllStores]);

  return {
    getAllStores,
    sedes,
    loading,
    statusMessage,
    success,
  };
}
