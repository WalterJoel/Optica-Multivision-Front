import {
  MetodoPago,
  TipoVenta,
  EstadoPago,
  TipoProducto,
} from "@/commons/constants";

export interface VentaProducto {
  productoId: number;
  tipoProducto: TipoProducto;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  descuento?: number;

  // ✅ Para lentes
  stockId?: number;
  esf?: number;
  cyl?: number;

  // ✅ Para monturas y accesorios
  stockProductoId?: number;
}

export interface ICreateSale {
  sedeId: number;
  userId: number;
  responsableVenta?: string;
  metodoPago: MetodoPago;
  tipoVenta: TipoVenta;
  estadoPago?: EstadoPago;
  montaje?: boolean;
  nroCuotas?: number;
  observaciones?: string;
  tipoComprobante?: string;
  nroComprobante?: string;
  kitId?: number;
  productos: VentaProducto[];
  total: number;
  montoPagado: number;
  deuda: number;
}

export interface IResponseSale {
  id: number;
  activo: boolean;
  total: string;
  montoPagado: string;
  deuda: string;
  kitId: number;
  sedeId: number;
  userId: number;
  responsableVenta: string;
  metodoPago: string;
  tipoVenta: string;
  estadoPago: string;
  montaje: boolean;
  nroCuotas: number | null;
  observaciones: string | null;
  tipoComprobante: string | null;
  nroComprobante: string | null;
  createdAt: string;
  updatedAt: string;
  productos: ProductSale[];
}

export interface ProductSale {
  id: number;
  ventaId: number;
  productoId: number;
  tipoProducto: TipoProducto;
  precioUnitario: string;
  subtotal: string;
  descuento: string | null;
  cantidad: number;
  stockId: number;
  esf: string;
  cyl: string;
  stockProductoId: number | null;
  createdAt: string;
}
