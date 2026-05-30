import { useState } from "react";
import { IAccessory } from "@/types/products/accessory";
import { getAllAccessoriesService } from "@/services/products/accesories";

export function useAccessories(sedeId: number) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [accessories, setAccessories] = useState<IAccessory[]>([]);

  const getAllAccessoriesData = async () => {
    if (loading) return; // evita doble request

    setLoading(true);
    setMessage("");

    try {
      const data = await getAllAccessoriesService(sedeId);

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
