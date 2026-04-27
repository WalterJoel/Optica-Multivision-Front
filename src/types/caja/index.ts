export interface ICreateCaja {
  sedeId: number;
  userId: number;
  saldoInicial: number;
}
export interface ICerrarCaja {
  cajaId: number;
}

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
