import { useState } from "react";
import { ICreateKit } from "@/types/kits";
import { createKitService } from "@/services/kits";

export function useCreateKit() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const addKit = async (payload: ICreateKit) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      await createKitService(payload);
      setSuccess(true);
      setMessage("Kit creado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al registrar kit: " + backendMessage
          : "Error al registrar kit",
      );
    } finally {
      setLoading(false);
    }
  };

  return { addKit, loading, statusMessage, success };
}
