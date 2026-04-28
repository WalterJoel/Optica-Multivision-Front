import { useState } from "react";
import { IAccessory } from "@/types/products/accessory";
import { getAllAccessories } from "@/services/products/accesories";

export function useAccessories() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [accessories, setAccessories] = useState<IAccessory[]>([]);

  const getAllAccessoriesData = async () => {
    if (loading) return; // evita doble request

    setLoading(true);
    setMessage("");

    try {
      const data = await getAllAccessories();

      setAccessories(data || []);
      setMessage("Accesorios obtenidos correctamente");
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? "Error al obtener accesorios");
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllAccessoriesData,
    accessories,
    loading,
    statusMessage,
  };
}
