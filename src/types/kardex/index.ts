import { TipoProducto, OrigenEventoKardex } from "@/commons/constants";
export { OrigenEventoKardex };


export interface IKardexRegistro {
  id: number;
  sedeId: number;
  tipoProducto: TipoProducto;
  productoId: number | null;
  stockId: number | null;
  origenEvento: OrigenEventoKardex | string;
  cantidadAnterior: number;
  cantidadMovimiento: number;
  cantidadFinal: number;
  createdAt: string;
  sede?: { id: number; nombre: string };
  producto?: {
    id: number;
    nombre: string;
    montura?: { codigo?: string; marca?: string; material?: string };
    accesorio?: { codigoAccesorio?: string; nombre?: string; marca?: string; material?: string };
  };
  stock?: {
    id: number;
    esf?: string;
    cyl?: string;
    lente?: { marca?: string; material?: string; tipo?: string };
  };
}

export interface IQueryKardexParams {
  sedeId?: number;
  tipoProducto?: TipoProducto | string;
  productoId?: number;
  stockId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IKardexResponse {
  data: IKardexRegistro[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
