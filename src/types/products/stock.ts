import { TipoProducto } from "@/commons/constants";

interface IUpdateStockProducto {
  productoId: number;
  cantidad: number;
}

export type IUpdateStockProductos = {
  items: IUpdateStockProducto[];
};

export interface IEyeglassQrResponse {
  montura: {
    id: number;
    codigo: string;
    codigoQr: string;
    productoId: number;
    precio: number;
    marca: string;
    imagenUrl?: string | null;
  };
  stock: {
    id: number;
    cantidad: number;
    ubicacion: string;
    updateAt: string;
  };
}

export type IOutdatedStockProductosPayload = {
  tipoProducto: TipoProducto;
  idSede: number;
};
export interface IOutdatedProductStockResponse {
  id: number;
  nombre: string;
  tipo: TipoProducto | string;
  cantidad: number;
  activo: boolean;
  ubicacion?: string;
  precioCompra: number;
  precioVenta: number;
  sedeId: number;
  monturaId?: number | null;
  accesorioId?: number | null;
  createdAt: string;
  updatedAt: string;
  montura?: {
    id: number;
    codigo: string;
    codigoMontura: string;
    marca: string;
    material?: string;
    talla?: string;
    color?: string;
    formaFacial?: string;
    sexo?: string;
    clasificacion?: string;
    imagenUrl?: string | null;
  } | null;
  accesorio?: {
    id: number;
    codigo: string;
    nombre: string;
    marca?: string;
  } | null;
}

