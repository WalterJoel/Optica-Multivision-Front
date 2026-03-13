import { PRODUCTOS } from "@/commons/constants";

export interface ILens {
  id: number;
  marca: string;
  productoId: number;
  material: string;
  precio_serie1: number;
  precio_serie2: number;
  precio_serie3: number;
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
