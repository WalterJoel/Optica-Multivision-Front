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
