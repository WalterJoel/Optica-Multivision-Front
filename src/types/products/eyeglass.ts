import { PRODUCTOS } from "@/commons/constants";

export interface IEyeglass {
  id: number;
  productoId: number;
  precio: number;
  marca: string;
  material: string;
  medida: string;
  color: string;
  formaFacial: string;
  sexo: string;
  imagenUrl?: string;
  createdAt?: string;
  producto?: {
    id: number;
    nombre: string;
    tipo: string;
    activo: boolean;
    createdAt?: string;
  };
}

export type ICreateEyeglass = Omit<
  IEyeglass,
  "id" | "productoId" | "createdAt" | "producto"
> & {
  tipo: PRODUCTOS;
};

export type IUpdateEyeglass = Partial<ICreateEyeglass>;

export interface IEyeglassQrResponse {
  montura: {
    id: number;
    codigo: string;
    codigoQr: string;
    productoId: number;
    precio: number;
    marca: string;
  };
  stock: {
    id: number;
    cantidad: number;
    ubicacion: string;
    updateAt: string;
  };
}
