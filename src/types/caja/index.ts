export interface ICreateCaja {
  sedeId: number;
  userId: number;
  saldoInicial: number;
}

export type IEstadoCaja = 'ABIERTA' | 'CERRADA';

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
  saldoFinal: number;
}
