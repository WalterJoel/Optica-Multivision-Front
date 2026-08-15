import { useState } from "react";
import { ICreateSale, IResponseSale } from "@/types/sales";
import { createSaleService } from "@/services/sales";

export function useCreateSale() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [createdSale, setCreatedSale] = useState<IResponseSale | null>(null);

  const addSale = async (payload: ICreateSale) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");
    setCreatedSale(null);

    try {
      const response = await createSaleService(payload);
      const saleObj: IResponseSale = response?.data || response;
      setCreatedSale(saleObj);
      setSuccess(true);
      setMessage(response?.message || "Venta creada correctamente");
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

  return { addSale, loading, statusMessage, success, createdSale };
}
