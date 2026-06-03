import { useState, useCallback } from "react";
import { getDiscountsService } from "@/services/discounts";
import { IDescuento } from "@/types/discounts";

export function useDiscounts() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [discounts, setDiscounts] = useState<IDescuento[]>([]);

  const getAllDiscounts = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await getDiscountsService();
      setDiscounts(data || []);
      setMessage("Descuentos obtenidos correctamente");
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? "Error al obtener descuentos");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getAllDiscounts,
    discounts,
    loading,
    statusMessage,
  };
}
