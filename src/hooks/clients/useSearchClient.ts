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

    debounceRef.current = setTimeout(async () => {
      if (!value || value.length < 2) {
        setClients([]);
        setShowList(false);
        return;
      }

      setLoading(true);

      try {
        const data = await searchClient(value);
        setClients(data);
        setShowList(true);
      } catch (error) {
        console.error("Error buscando clientes", error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const selectClient = (client: ISearchClient) => {
    const name = client.nombres
      ? `${client.nombres} ${client.apellidos ?? ""}`
      : client.numeroDoc;

    setClients([]);
    setShowList(false);
  };

  return {
    clients,
    loading,
    showList,
    searchClients,
    selectClient,
  };
}
