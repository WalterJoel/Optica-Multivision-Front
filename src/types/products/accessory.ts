import { PRODUCTOS } from "@/commons/constants";

export interface IAccessory {
  id: number;
  sedeId: number;
  productoId: number;
  codigoAccesorio: string;
  color: string;
  precioVenta: number;
  precioCompra: number;
  nombre: string;
  ubicacion?: string;
  imagenUrl?: string;
  createdAt?: string;
  cantidad: number;
  producto?: {
    id: number;
    nombre: string;
    cantidad: number;
    tipo: string;
    activo: boolean;
    createdAt?: string;
  };
}

export type ICreateAccessory = Omit<IAccessory, "id" | "productoId" | "createdAt" | "producto"> & {};

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

export interface IAccesoryQrResponse {
  accesorio: {
    id: number;
    codigo: string;
    productoId: string;
    precio: number;
    nombre: string;
  };
  stock: {
    id: number;
    cantidad: number;
    ubicacion: string;
    updateAt: string;
  };
}
