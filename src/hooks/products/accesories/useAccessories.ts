import { useState } from "react";
import { IAccessory } from "@/types/products/accessory";
import { getAllAccessories } from "@/services/products/accesories";

export function useAccessories() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [accessories, setAccessories] = useState<IAccessory[]>([]);

  const getAllAccessoriesData = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const data = await getAllAccessories();
      setAccessories(data);
      setSuccess(true);
      setMessage("Accesorios obtenidos correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al obtener accesorios: " + backendMessage
          : "Error al obtener accesorios",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllAccessoriesData,
    accessories,
    loading,
    statusMessage,
    success,
  };
}