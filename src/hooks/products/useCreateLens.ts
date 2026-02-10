import { useState } from "react";
import { Lens, CreateLens } from "@/types/products";
import { createLens } from "@/services/products";

export function useCreateLens() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLens = async (payload: CreateLens) => {
    try {
      setLoading(true);
      await createLens(payload);
    } catch (err: any) {
      setError(err.message || "Error al crear lente");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addLens, loading, error };
}
