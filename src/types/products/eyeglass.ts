import { PRODUCTOS } from "@/commons/constants";

export interface IEyeglass {
  id: number;
  sedeId: number;
  productoId: number;
  precioVenta: number;
  precioCompra: number;
  marca: string;
  codigo: string;
  codigoMontura: string;
  material: string;
  talla: string;
  color: string;
  formaFacial: string;
  sexo: string;
  imagenUrl?: string;
  cantidad: number;
  createdAt?: string;
  producto?: {
    id: number;
    nombre: string;
    ubicacion?: string;
    cantidad: number;
    tipo: string;
    activo: boolean;
    createdAt?: string;
  };
}

export type ICreateEyeglass = Omit<
  IEyeglass, "id" | "productoId" | "createdAt" | "producto"> & { ubicacion?: string };

export type IUpdateEyeglass = Partial<ICreateEyeglass> & { productoId?: number; activo?: boolean };
