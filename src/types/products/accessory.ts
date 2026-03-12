import { PRODUCTOS } from '@/commons/constants';

export interface IAccessory {
  id: number;
  precio: number;
  nombre: string;
  atributo: string;
  imagenUrl: string;
  createdAt: string;
}

export type ICreateAccessory = Omit<IAccessory, 'id' | 'createdAt'> & {};

export interface ISearchAccesory {
  id: number;
  // nombres: string | null;
  // cantidad: number;
}
