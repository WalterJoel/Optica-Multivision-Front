export enum TipoMovimiento {
  INGRESO = 'INGRESO',
  EGRESO = 'EGRESO',
}
export interface ICrearMovimientoCaja {
  cajaId: number;
  tipo: TipoMovimiento;
  monto: number;
  descripcion?: string;
  ventaId?: number;
  metodoPago?: string;
}
