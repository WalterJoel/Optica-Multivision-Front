import { useState } from "react";
import { IAccessory } from "@/types/products/accessory";
import { getAllKits } from "@/services/kits";
import { IKit } from "@/types/kits";

export function useKits() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [Kits, setKits] = useState<IKit[]>([]);

  const getAllLenses = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const data = await getAllKits();
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

  return { getAllLenses, Kits, loading, statusMessage, success };
}
