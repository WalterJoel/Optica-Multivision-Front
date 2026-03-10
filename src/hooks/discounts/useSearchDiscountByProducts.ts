import { useState, useRef } from "react";
// import { ILens } from "@/types/products/lens";
import { searchDiscountsByProducts } from "@/services/discounts";

export function useSearchDiscountByProducts() {
  const [loading, setLoading] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [showList, setShowList] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchDiscounts = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!value || value.length < 2) {
        setDiscounts([]);
        setShowList(false);
        return;
      }

      setLoading(true);

      try {
        const data = await searchDiscountsByProducts(value);
        setDiscounts(data);
        setShowList(true);
      } catch (error) {
        console.error("Error buscando lentes", error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return {
    discounts,
    loading,
    showList,
    searchDiscounts,
    setShowList,
  };
}
