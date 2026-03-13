import { PRODUCTOS } from "@/commons/constants";

export interface IAccessory {
  id: number;
  precio: number;
  nombre: string;
  atributo: string;
  imagenUrl: string;
  createdAt: string;
  basico: boolean;
}

export type ICreateAccessory = Omit<IAccessory, "id" | "createdAt"> & {};

export interface ISearchAccesory {
  id: number;
  precio: number;
  nombre: string;
  productoId: number;
}

export interface IResponseSearchAccesory {
  total: number;
  accesorios: ISearchAccesory[];
}
