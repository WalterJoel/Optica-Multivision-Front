import { api } from "../api";

export interface StockChange {
  id: number;
  cantidad: number;
}

export const UpdateLensStock = async (changes: StockChange[]) => {
  // Eliminar duplicados y tomar la última cantidad de cada id
  const grouped: Record<number, number> = {};
  changes.forEach((item) => {
    grouped[item.id] = item.cantidad; // la última cantidad gana
  });

  const payload = Object.entries(grouped).map(([id, cantidad]) => ({
    id: Number(id),
    cantidad,
  }));

  // POST al backend
  const { data } = await api.post("/productos/updateLensStock", {
    items: payload,
  });

  return data;
};
