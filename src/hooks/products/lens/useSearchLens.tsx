import { useState, useRef } from "react";
import { ILens } from "@/types/products/lens";
import { searchLens } from "@/services/products/lens";

export function useSearchLens() {
  const [loading, setLoading] = useState(false);
  const [lens, setLens] = useState<ILens[]>([]);
  const [showList, setShowList] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchlens = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value || value.length < 2) {
      setLens([]);
      setShowList(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchLens(value);
        setLens(data);
        setShowList(true);
      } catch (error) {
        console.error("Error buscando lentes", error);
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  return {
    lens,
    loading,
    showList,
    searchlens,
    setShowList,
  };
}
