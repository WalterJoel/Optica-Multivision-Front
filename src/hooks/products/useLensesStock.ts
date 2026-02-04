import { useEffect, useState } from "react";
import { getStockByLenteAndSede, StockMatrix } from "@/services/products";

export const useLenteStock = (
  lenteId: number | null,
  sedeId: number | null,
  refreshKey?: number,
) => {
  const [stock, setStock] = useState<StockMatrix | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lenteId || !sedeId) return;

    setLoading(true);
    setError(null);

    getStockByLenteAndSede(lenteId, sedeId)
      .then((matrix) => setStock(matrix))
      .catch((err) => setError(err.message || "Error al cargar stock"))
      .finally(() => setLoading(false));
  }, [lenteId, sedeId, refreshKey]);

  return { stock, loading, error };
};
