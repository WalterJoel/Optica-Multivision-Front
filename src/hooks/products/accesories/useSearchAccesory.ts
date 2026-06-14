import { useState, useRef } from "react";
import { ISearchAccesory } from "@/types/products";
import { searchAccesoryService } from "@/services/products/accesories";
import { useSessionUser } from "@/hooks/session";

export function useSearchAccesory() {
  const [loading, setLoading] = useState(false);
  const [accesories, setAccesories] = useState<ISearchAccesory[]>([]);
  const [showList, setShowList] = useState(false);
  const { sedeId } = useSessionUser();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchAccesories = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value || value.length < 2) {
      setAccesories([]);
      setShowList(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchAccesoryService(sedeId || 0, value);
        setAccesories(data);
        setShowList(true);
      } catch (error) {
        console.error("Error buscando accesorios", error);
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  return {
    accesories,
    loading,
    showList,
    searchAccesories,
    setShowList,
  };
}
