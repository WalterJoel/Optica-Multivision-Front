import { useState, useRef } from "react";
import { ISearchClient } from "@/types/clients";
import { searchClient } from "@/services/clients";

export function useSearchClient() {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<ISearchClient[]>([]);
  const [showList, setShowList] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchClients = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value || value.length < 2) {
      setClients([]);
      setShowList(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchClient(value);
        setClients(data);
        setShowList(true);
      } catch (error) {
        console.error("Error buscando clientes", error);
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  return {
    clients,
    loading,
    showList,
    searchClients,
    setShowList,
  };
}
