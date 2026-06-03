export interface ICreateDiscount {
  clienteId: number;
  productoId?: number | null;
  lenteId?: number | null;
  serie?: number | null;
  activo?: boolean;
  montoDescuento: number;
  tipoProducto: string;
}

export interface ISeries {
  id: number;
  nombre: string;
  value: number;
  precio: number;
  descuento: number;
  icono: string;
}

export interface IResponseDiscountByProduct {
  id: number;
  productoId: number;
  nombreProducto: string;
  esLente: boolean;
  serie: number;
  montoDescuento: number;
}

export interface IDescuento {
  id: number;
  clienteId: number;
  productoId?: number | null;
  lenteId?: number | null;
  serie?: number | null;
  montoDescuento: number;
  tipoProducto: string;
  activo: boolean;
  createdAt: string;
  producto?: {
    id: number;
    nombre: string;
    codigoAccesorio?: string;
    color?: string;
  } | null;
  lente?: {
    id: number;
    marca: string;
    material: string;
  } | null;
}
