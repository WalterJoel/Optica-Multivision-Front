import { useState, useRef } from "react";
import { ISearchlen } from "@/types/lens";
import { searchlen } from "@/services/lens";

export function useSearchLens() {
  const [loading, setLoading] = useState(false);
  const [lens, setLens] = useState<ISearchlen[]>([]);
  const [showList, setShowList] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchlens = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!value || value.length < 2) {
        setLens([]);
        setShowList(false);
        return;
      }

      setLoading(true);

      try {
        const data = await searchlen(value);
        setLens(data);
        setShowList(true);
      } catch (error) {
        console.error("Error buscando lenes", error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const selectlen = (len: ISearchlen) => {
    const name = len.nombres
      ? `${len.nombres} ${len.apellidos ?? ""}`
      : len.numeroDoc;

    setLens([]);
    setShowList(false);
  };

  return {
    lens,
    loading,
    showList,
    searchlens,
    selectlen,
  };
}
