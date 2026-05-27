import { useState } from "react";
import { IAccessory } from "@/types/products/accessory";
import { getAllBasicAccessoriesService } from "@/services/products/accesories";

export function useBasicAccessories() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [basicAccessories, setbasicAccessories] = useState<IAccessory[]>([]);

  const getAllBasicAccessories = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const data = await getAllBasicAccessoriesService();
      setbasicAccessories(data);
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
    getAllBasicAccessories,
    basicAccessories,
    loading,
    statusMessage,
    success,
  };
}
