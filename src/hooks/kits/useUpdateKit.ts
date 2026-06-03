import { useState } from "react";
import { updateKitService } from "@/services/kits";
import { ICreateKitAccesory } from "@/types/kits";

export function useUpdateKit() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const updateKit = async (id: number, payload: Partial<ICreateKitAccesory>) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateKitService(id, payload);
      setSuccess(true);
      setMessage("Kit actualizado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al actualizar kit: " + backendMessage
          : "Error al actualizar kit",
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateKit, loading, statusMessage, success };
}
