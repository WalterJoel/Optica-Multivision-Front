import { IAccessory } from "@/types/products";

export interface IKit {
  id: number;
  nombre: string;
  precio: number;
  activo: boolean;
  createdAt: Date;
  descripcion: string;
  accesorios: IAccessory[];
}

export interface IResponseKitAccesory {
  id: number;
  nombre: string;
  productoId: number;
  precio: number;
}
export interface IKitAccesory {
  id: number;
  nombre: string;
  cantidad: number;
  productoId: number;
  precio: number;
}

export interface ICreateKit {
  nombre: string;
  precio: number;
  descripcion: string;
}
export interface ICreateAccesory {
  cantidad: number;
  accesorioId: number;
}
export interface ICreateKitAccesory {
  nombre: string;
  precio: number;
  descripcion: string;
  accesorios: ICreateAccesory[];
}
