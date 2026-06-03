import { useState } from "react";
import { deleteDiscountService } from "@/services/discounts";

export function useDeleteDiscount() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const deleteDiscount = async (id: number) => {
    setLoading(true);
    setSuccess(false);

    try {
      await deleteDiscountService(id);
      setSuccess(true);
      setMessage("Descuento eliminado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al eliminar descuento: " + backendMessage
          : "Error al eliminar descuento",
      );
    } finally {
      setLoading(false);
    }
  };

  return { deleteDiscount, loading, statusMessage, success };
}
