import { IAccessory } from '@/types/products';

export interface IKit {
  id: number;
  nombre: string;
  precio: number;
  activo: boolean;
  createdAt: Date;
  descripcion: string;
  accesorios: IAccessory[];
}

export interface ICreateKitAccesory {
  cantidad: number;
  accesorioId: number;
}

export interface IListKitAccesory {
  accesorioId: number;
  nombre: string;
  cantidad: number;
}

export interface ICreateKit {
  nombre: string;
  precio: number;
  descripcion: string;
  accesorios: ICreateKitAccesory[];
}
