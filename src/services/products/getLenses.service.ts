import { ROUTES_MANIFEST } from "next/dist/shared/lib/constants";
import { api } from "../api";
import { Lens } from "@/types/products";

export const getLenses = async (): Promise<Lens[]> => {
  const { data } = await api.get("/productos/lentes");
  return data;
};
