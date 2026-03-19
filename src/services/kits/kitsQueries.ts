import { IKit } from "@/types/kits";
import { api } from "../api";

export const getAllKits = async (): Promise<IKit[]> => {
  const { data } = await api.get("/kits/kits");
  return data;
};
