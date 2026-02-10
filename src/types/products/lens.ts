import { PRODUCTOS } from "@/commons/constants";

export interface Lens {
  id: number;
  marca: string;
  material: string;
  precio_serie1: number | string;
  precio_serie2: number | string;
  precio_serie3: number | string;
  imagenUrl: string;
}

export type CreateLens = Omit<Lens, "id"> & {
  tipo: PRODUCTOS;
};
