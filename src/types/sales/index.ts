import {
  MetodoPago,
  TipoVenta,
  EstadoPago,
  TipoProducto,
} from "@/commons/constants";
import { IUser } from "../users";
import { IClient } from "../clients";

export interface VentaProducto {
  productoId?: number;
  tipoProducto: TipoProducto;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  descuento?: number;

  // ✅ Para lentes
  stockId?: number;
  esf?: number;
  cyl?: number;
}

export interface ICreateSale {
  sedeId: number;
  userId: number;
  clienteId?: number | null;
  metodoPago: MetodoPago;
  tipoVenta: TipoVenta;
  estadoPago?: EstadoPago;
  montaje?: boolean;
  nroCuotas?: number | null;
  observaciones?: string;
  tipoComprobante?: string;
  nroComprobante?: string;
  productos: VentaProducto[];
  total: number;
  montoPagado: number;
  deuda: number;
  diasCompromisoPago?: number | null;
}

export interface IResponseSale {
  id: number;
  sedeId: number;
  userId: number;
  clienteId?: number | null;
  activo: boolean;
  total: string;
  montoPagado: string;
  deuda: string;
  tipoVenta: string;
  estadoPago: string;
  metodoPago: string;
  diasCompromisoPago?: string | null
  montaje: boolean;
  nroCuotas: number | null;
  observaciones: string | null;
  tipoComprobante: string | null;
  nroComprobante: string | null;
  createdAt: string;
  updatedAt: string;
  productos: ProductSale[];
  user?: IUser;
  cliente?: IClient | null;
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
  stockId?: number | null;
  esf?: string | null;
  cyl?: string | null;
  createdAt: string;
  producto?: any;
  stock?: any;
}
