import { useState } from "react";
import { ICreateDiscount } from "@/types/discounts";
import { updateDiscountService } from "@/services/discounts";

export function useUpdateDiscount() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const updateDiscount = async (id: number, payload: Partial<ICreateDiscount>) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateDiscountService(id, payload);
      setSuccess(true);
      setMessage("Descuento actualizado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al actualizar descuento: " + backendMessage
          : "Error al actualizar descuento",
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateDiscount, loading, statusMessage, success };
}
