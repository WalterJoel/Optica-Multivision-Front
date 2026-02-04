import { api } from "../api";

export interface CreateLensPayload {
  brand: string;
  material: string;
  priceSeries1: number;
  priceSeries2: number;
  priceSeries3: number;
  image: File;
}

export const createLens = async (payload: CreateLensPayload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value as any);
  });

  const { data } = await api.post("/lenses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};
