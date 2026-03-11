import { useState } from "react";
import { ICreateDiscount } from "@/types/discounts";
import { createDiscountService } from "@/services/discounts";

export function useCreateDiscount() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const addDiscount = async (payload: ICreateDiscount) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      await createDiscountService(payload);
      setSuccess(true);
      setMessage("Descuento creado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al registrar descuento: " + backendMessage
          : "Error al registrar descuento",
      );
    } finally {
      setLoading(false);
    }
  };

  return { addDiscount, loading, statusMessage, success };
}
