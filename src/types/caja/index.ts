export interface ICreateCaja {
  sedeId: number;
  userId: number;
  saldoInicial: number;
}

export type IEstadoCaja = "ABIERTA" | "CERRADA";

export type ICaja = {
  id: number;
  sedeId: number;
  userId: number;
  estado: IEstadoCaja;
  saldoInicial: string;
  saldoFinal: string;
  fechaApertura: string;
  fechaCierre: string | null;
};

export type IValidarCajaAbiertaResponse = {
  existe: boolean;
  caja: ICaja | null;
};
export interface ICerrarCaja {
  cajaId: number;
}

export enum TipoMovimiento {
  INGRESO = "INGRESO",
  EGRESO = "EGRESO",
}
export interface ICrearMovimientoCaja {
  cajaId: number;
  tipo: TipoMovimiento;
  monto: number;
  descripcion?: string;
  ventaId?: number;
  metodoPago?: string;
}
