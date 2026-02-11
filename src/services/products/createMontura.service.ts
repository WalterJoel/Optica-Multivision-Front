import { api } from "../api";
import { CreateMontura } from "@/types/products";

export const createMontura = async (payload: CreateMontura) => {
  const { data } = await api.post("/monturas", payload);
  return data;
};
