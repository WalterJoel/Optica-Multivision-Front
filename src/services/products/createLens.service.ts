import { api } from "../api";

import { CreateLens } from "@/types/products";

export const createLens = async (payload: CreateLens) => {
  const { data } = await api.post("/productoss", payload);
  return data;
};
