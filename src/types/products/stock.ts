import { TipoProducto } from "@/commons/constants";

interface IUpdateStockProducto {
  stockId: number;
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
  id: string;
  sedeId: string;
  productoId: string;
  cantidad: string;
  ubicacion: string;
  createdAt: string;
  updatedAt: string;
  producto: {
    id: string;
    nombre: string;
    activo: string;
    tipo: string;
    createdAt: string;
    montura: {
      id: string;
      codigo: string;
      codigoQr: string;
    };
  };
}
