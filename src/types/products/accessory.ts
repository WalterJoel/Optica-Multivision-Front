import { PRODUCTOS } from "@/commons/constants";

export interface Accessory {
  id: number;
  marca: string;
  material: string;
  precio_serie1: number;
  precio_serie2: number;
  precio_serie3: number;
  imagenUrl?: string;
}

export type CreateAccessory = Omit<Accessory, "id"> & {
  tipo: PRODUCTOS;
};
