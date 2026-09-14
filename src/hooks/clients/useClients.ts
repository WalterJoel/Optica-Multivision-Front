import { useState, useCallback, useRef } from "react";
import { searchClient } from "@/services/clients";
import { IClient } from "@/types/clients";

export function useClients(initialLimit = 50) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [clientes, setClientes] = useState<IClient[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [searchTerm, setSearchTermState] = useState("");

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchClientes = useCallback(
    async (search = "", pageNum = 1, limitNum = 50) => {
      setLoading(true);
      setMessage("");

      try {
        const offset = (pageNum - 1) * limitNum;
        const data = await searchClient(search, limitNum, offset);
        setClientes(data.clientes || []);
        setTotal(data.total || 0);
        setMessage("Clientes obtenidos correctamente");
      } catch (err: any) {
        setMessage(err?.response?.data?.message ?? "Error al obtener clientes");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const loadClientes = useCallback(() => {
    fetchClientes(searchTerm, page, limit);
  }, [fetchClientes, searchTerm, page, limit]);

  const setSearchTerm = (term: string) => {
    setSearchTermState(term);
    setPage(1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchClientes(term, 1, limit);
    }, 300);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchClientes(searchTerm, newPage, limit);
  };

  return {
    loadClientes,
    clientes,
    total,
    page,
    limit,
    searchTerm,
    setSearchTerm,
    setPage: handlePageChange,
    loading,
    statusMessage,
  };
}
