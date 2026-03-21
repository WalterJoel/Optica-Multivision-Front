import { useState } from "react";
import { searchDiscountsByProducts } from "@/services/discounts";
import { IResponseDiscountByProduct } from "@/types/discounts";

export function useSearchDiscountByProducts() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [discounts, setDiscounts] = useState<IResponseDiscountByProduct[]>([]);

  const searchDiscounts = async (payload) => {
    setLoading(true);
    setSuccess(false);
    setDiscounts([]); // Limpiar resultados previos

    try {
      const data = await searchDiscountsByProducts(payload);
      setDiscounts(data);
      setSuccess(true);

      if (!data || data.length === 0) {
        setMessage(
          "No se encontraron descuentos aplicables para este cliente.",
        );
      } else {
        setMessage("Listado de Descuentos correcto");
      }
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al listar Discounts: " + backendMessage
          : "Error al listar Discounts",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    searchDiscounts,
    discounts,
    loading,
    statusMessage,
    success,
    setDiscounts,
  };
}
