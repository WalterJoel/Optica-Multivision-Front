import { PRODUCTOS } from "@/commons/constants";

export interface ILens {
  id: number;
  marca: string;
  material: string;
  precio_serie1: number;
  precio_serie2: number;
  precio_serie3: number;
  imagenUrl: string;
}

export type CreateLens = Omit<ILens, "id"> & {
  tipo: PRODUCTOS;
};

export type InventoryByStoreResponse = {
  precioCalculado: number;
  sedes: {
    id: number;
    nombre: string;
    unidades: number;
  }[];
};

export type ISearchLensResponse = {
  total: number;
  lentes: ILens[];
};
