import { TipoProducto, OrigenSolicitudTraslado, EstadoTraslado } from "@/commons/constants";

export interface ITrasladoDetalle {
  id: number;
  trasladoId: number;
  tipoProducto: TipoProducto;
  productoId?: number | null;
  stockId?: number | null;
  cantidadSolicitada: number;
  cantidadEnviada: number;
  cantidadRecibida: number;
  observacion?: string | null;
  producto?: {
    id: number;
    nombre: string;
    montura?: {
      id: number;
      codigo: string;
      marca: string;
      material: string;
    } | null;
    accesorio?: {
      id: number;
      nombre: string;
      marca?: string;
      material?: string;
      codigoAccesorio?: string;
    } | null;
  } | null;
  stock?: {
    id: number;
    esf?: string | null;
    cyl?: string | null;
    lente?: {
      id: number;
      marca: string;
      material: string;
      tipo?: string;
    } | null;
  } | null;
}

export interface ITraslado {
  id: number;
  estado: EstadoTraslado;
  origenSolicitud: OrigenSolicitudTraslado;
  sedeProveedoraId: number;
  sedeSolicitanteId: number;
  usuarioSolicitanteId: number;
  observaciones?: string | null;
  createdAt: string;
  updatedAt: string;
  sedeProveedora?: {
    id: number;
    nombre: string;
  };
  sedeSolicitante?: {
    id: number;
    nombre: string;
  };
  usuarioSolicitante?: {
    id: number;
    nombre: string;
  };
  detalles: ITrasladoDetalle[];
}

export interface ICrearTrasladoDetalle {
  tipoProducto: TipoProducto;
  productoId?: number;
  stockId?: number;
  cantidadSolicitada: number;
  cantidad?: number;
  observacion?: string;
}

export interface ICrearTrasladoPayload {
  origenSolicitud: OrigenSolicitudTraslado;
  sedeProveedoraId: number;
  sedeSolicitanteId: number;
  usuarioSolicitanteId: number;
  observaciones?: string;
  detalles: ICrearTrasladoDetalle[];
}

export interface IEnviarMercaderiaPayload {
  trasladoId: number;
  tipoProducto?: TipoProducto;
  observaciones?: string;
  detalles: {
    detalleId: number;
    cantidadEnviada: number;
    observacion?: string;
  }[];
}

export interface IRecibirMercaderiaPayload {
  trasladoId: number;
  usuarioReceptorId?: number;
  tipoProducto?: TipoProducto;
  observaciones?: string;
  detalles: {
    detalleId: number;
    cantidadRecibida: number;
    observacion?: string;
  }[];
}
