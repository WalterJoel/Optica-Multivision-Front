import { useState } from "react";
import { createMontura } from "@/services/products/createMontura.service";
import { CreateMontura } from "@/types/products";

export const useMonturas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMontura = async (payload: CreateMontura) => {
    try {
      setLoading(true);
      setError(null);
      await createMontura(payload);
    } catch (e: any) {
      setError("Error al registrar montura");
    } finally {
      setLoading(false);
    }
  };

  return {
    addMontura,
    loading,
    error,
  };
};
