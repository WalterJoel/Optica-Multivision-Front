import { useState, useRef } from "react";
import { ISearchAccesory } from "@/types/products";
import { searchAccesory } from "@/services/products/accesories";

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
        const data = await searchAccesory(value);
        setAccesories(data);
        setShowList(true);
      } catch (error) {
        console.error("Error buscando accesorios", error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return {
    accesories,
    loading,
    showList,
    searchAccesories,
    setShowList,
  };
}
