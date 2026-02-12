import { PRODUCTOS } from "@/commons/constants";

export interface Montura {
  id: number;
  fecha: string;
  material: string;
  marca: string;
  sede: string;
  codigo_interno: string;
  codigo_montura: string;
  talla: string;
  color: string;
  precio_compra: number;
  precio_venta: number;
  stock: number;
}

export type CreateMontura = Omit<Montura, "id"> & {
  tipo: PRODUCTOS;
};
