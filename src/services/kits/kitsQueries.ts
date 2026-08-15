import { IKit } from "@/types/kits";
import { api } from "../api";

export const getAllKitsService = async (sedeId: number): Promise<IKit[]> => {
  const { data } = await api.get("/kits/kits", {
    params: { sedeId },
  });
  return data;
};
