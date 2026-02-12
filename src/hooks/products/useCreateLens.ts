import { useState } from "react";
import { CreateLens } from "@/types/products";
import { createLens } from "@/services/products";

export function useCreateLens() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const addLens = async (payload: CreateLens) => {
    setLoading(true);
    setSuccess(false);

    try {
      await createLens(payload);
      setSuccess(true);
      setMessage("Lente creado correctamente");
    } catch (err: any) {
      setMessage("Error al registrar lente");
    } finally {
      setLoading(false);
    }
  };

  return { addLens, loading, statusMessage, success };
}
