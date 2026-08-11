import { useState, useCallback, useRef } from "react";
import { IVentaPorTipoItem } from "@/types/sales";
import { buscarProductoParaTrasladoService } from "@/services/traslados";

export function useBuscarProductosTraslado() {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [items, setItems] = useState<IVentaPorTipoItem[]>([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProductosForTransfer = useCallback(
    async (sedeId: number, tipo: string, busqueda?: string) => {
      if (!sedeId || !tipo || !busqueda || !busqueda.trim()) {
        setItems([]);
        setLoading(false);
        return;
      }

      if (debounceRef.current) clearTimeout(debounceRef.current);

      setLoading(true);
      setStatusMessage("");

      debounceRef.current = setTimeout(async () => {
        try {
          const data = await buscarProductoParaTrasladoService(
            sedeId,
            tipo,
            busqueda,
          );
          setItems(data || []);
        } catch (err: any) {
          const backendMessage = err.response?.data?.message;
          setStatusMessage(
            backendMessage
              ? `Error al buscar productos: ${backendMessage}`
              : "Error al buscar productos para traslado",
          );
          setItems([]);
        } finally {
          setLoading(false);
        }
      }, 250);
    },
    [],
  );

  const clearItems = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setItems([]);
  }, []);

  return {
    fetchProductosForTransfer,
    clearItems,
    items,
    loading,
    statusMessage,
  };
}
