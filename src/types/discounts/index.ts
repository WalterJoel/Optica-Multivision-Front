export interface ICreateDiscount {
  clienteId: number;
  sedeId?: number;
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
  cartItemId: number;
  productoId?: number | null;
  lenteId?: number | null;
  nombreProducto: string;
  esLente: boolean;
  serie?: number | null;
  montoDescuento: number;
}

export interface IDescuento {
  id: number;
  clienteId: number;
  sedeId?: number;
  productoId?: number | null;
  lenteId?: number | null;
  serie?: number | null;
  montoDescuento: number;
  tipoProducto: string;
  activo: boolean;
  createdAt: string;
  cliente?: {
    id: number;
    tipoCliente?: string;
    tipoDoc?: string;
    numeroDoc?: string;
    nombres?: string | null;
    apellidos?: string | null;
    razonSocial?: string | null;
    telefono?: string | null;
    correo?: string | null;
    direccion?: string | null;
  } | null;
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
