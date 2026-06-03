import { ICaja } from '../caja';

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
  caja: ICaja;
  id: number;
}
