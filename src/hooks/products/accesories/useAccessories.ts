import { useState } from "react";
import { IAccessory } from "@/types/products/accessory";
import { getAllAccessories } from "@/services/products/accesories";

export function useAccesories() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [accessories, setAccessories] = useState<IAccessory[]>([]);

  const getAllLenses = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const data = await getAllAccessories();
      setAccessories(data);
      setSuccess(true);
      setMessage("Sede creada correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al registrar sede: " + backendMessage
          : "Error al registrar sede",
      );
    } finally {
      setLoading(false);
    }
  };

  return { getAllLenses, accessories, loading, statusMessage, success };
}
