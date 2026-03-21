import { useState } from "react";
import { ICreateSale } from "@/types/sales";
import { createSaleService } from "@/services/sales";

export function useCreateSale() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const addSale = async (payload: ICreateSale) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      await createSaleService(payload);
      setSuccess(true);
      setMessage("Venta creada correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al registrar venta: " + backendMessage
          : "Error al registrar venta",
      );
    } finally {
      setLoading(false);
    }
  };

  return { addSale, loading, statusMessage, success };
}
