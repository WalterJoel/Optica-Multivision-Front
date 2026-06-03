import { api } from "../api";

import { CreateLens } from "@/types/products";

export const createLensService = async (payload: CreateLens) => {
  const { data } = await api.post("/productos/lentes/crearLente", payload);
  return data;
};
