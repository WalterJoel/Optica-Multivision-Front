import { useState, useRef } from "react";
import { IEyeglass } from "@/types/products/eyeglass";
import { searchEyeglasses } from "@/services/products/eyeglasses";

export function useSearchEyeglass() {
  const [eyeglasses, setEyeglasses] = useState<IEyeglass[]>([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchEyeglass = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!value || value.length < 2) {
        setEyeglasses([]);
        setShowList(false);
        return;
      }

      setLoading(true);

      try {
        const data = await searchEyeglasses(value);
        setEyeglasses(data?.monturas || []);
        setShowList(true);
      } catch (error) {
        console.error("Error buscando monturas", error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return {
    eyeglasses,
    loading,
    showList,
    searchEyeglass,
    setShowList,
  };
}