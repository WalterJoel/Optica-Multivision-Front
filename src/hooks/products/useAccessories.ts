import { useEffect, useState } from "react";
import { Accessory, CreateAccessory } from "@/types/products";
import {
  getAccessories,
  createAccessory,
} from "@/services/products/accessory.service";

export function useAccessories() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllAccessories = async () => {
    try {
      setLoading(true);
      const data = await getAccessories();
      setAccessories(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar accesorios");
    } finally {
      setLoading(false);
    }
  };

  const addAccessory = async (payload: CreateAccessory) => {
    try {
      setLoading(true);
      await createAccessory(payload);
      await getAllAccessories();
    } catch (err: any) {
      setError(err.message || "Error al crear accesorio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAccessories();
  }, []);

  return {
    accessories,
    loading,
    error,
    addAccessory,
    getAllAccessories,
  };
}
