import { PRODUCTOS, ClasificacionLentes, PrioridadLentes } from "@/commons/constants";
export interface ILens {
  id: number;
  marca: string;
  productoId: number;
  material: string;
  precio_serie1: number;
  precio_serie2: number;
  precio_serie3: number;
  kitId?: number | null;
  imagenUrl?: string | null;
  activo?: boolean;
  clasificacion: ClasificacionLentes;
  prioridad?: PrioridadLentes | null;
}

export type CreateLens = Omit<ILens, "id" | "productoId"> & {
  tipo: PRODUCTOS;
  sedeId: number;
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

// Interface para los items de la matriz de combinaciones
export interface ILensStockMatrixItem {
  id: number;
  productoId: number;
  esf: number;
  cyl: number;
  cantidad: number;
  nombreProducto: string;
}
