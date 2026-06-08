import { ICaja } from '../caja';
import { IResponseSale } from '../sales';
import { IStore } from '../stores';

export enum TipoMovimiento {
  INGRESO = "INGRESO",
  EGRESO = "EGRESO",
}

export interface ICrearMovimientoCaja {
  tipo: TipoMovimiento;
  monto: number;
  descripcion?: string;
  ventaId?: number;
  sedeId: number;
  metodoPago: string;
}

export interface IMovimientosCaja extends ICrearMovimientoCaja {
  createdAt: Date;
  // caja: ICaja;
  id: number;
}

export interface IMovimientoCajaResponse {
  id: number;
  sedeId: number;
  tipo: TipoMovimiento;
  monto: number;
  descripcion?: string;
  ventaId?: number;
  metodoPago: string;
  createdAt: string;
  venta?: IResponseSale | null;
  sede?: IStore | null;
}

