import { api } from "../api";
import { CreateAccessory, Accessory } from "@/types/products";

export const getAccessories = async (): Promise<Accessory[]> => {
  const { data } = await api.get("/accessories");
  return data;
};

export const createAccessory = async (
  payload: CreateAccessory,
): Promise<void> => {
  await api.post("/accessories", payload);
};
