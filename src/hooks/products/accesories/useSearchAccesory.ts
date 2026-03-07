import { useState, useRef } from 'react';
import { ISearchAccesory } from '@/types/products';
import {} from '@/services/clients';

export function useSearchAccesory() {
  const [loading, setLoading] = useState(false);
  const [accesories, setAccesories] = useState<ISearchAccesory[]>([]);
  const [showList, setShowList] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchAccesories = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!value || value.length < 2) {
        setAccesories([]);
        setShowList(false);
        return;
      }

      setLoading(true);

      try {
        const data = await searchAccesories(value);
        setAccesories(data);
        setShowList(true);
      } catch (error) {
        console.error('Error buscando clientes', error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const selectAccesory = (client: ISearchAccesory) => {
    const name = client.nombres
      ? `${client.nombres} ${client.apellidos ?? ''}`
      : client.numeroDoc;

    setAccesories([]);
    setShowList(false);
  };

  return {
    accesories,
    loading,
    showList,
    searchAccesories,
    selectAccesory,
  };
}
