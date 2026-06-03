import { useState, useRef } from "react";
import { IEyeglass } from "@/types/products/eyeglass";
import { searchEyeglassesService } from "@/services/products/eyeglasses";
import { useSessionUser } from "@/hooks/session";

export function useSearchEyeglass() {
  const [eyeglasses, setEyeglasses] = useState<IEyeglass[]>([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sedeId } = useSessionUser();

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
        const data = await searchEyeglassesService(sedeId || 0, value);
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