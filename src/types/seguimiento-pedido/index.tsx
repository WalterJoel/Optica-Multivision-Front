export type PedidoEstadoGeneral = "DENTRO" | "RETRASADO" | "CRITICO";

export type PedidoEtapaKey =
  | "ALMACEN"
  | "TALLER"
  | "TRANSITO"
  | "ENTREGA";

export interface IPedidoEtapa {
  key: PedidoEtapaKey;
  label: string;
  tiempo: string; // "15 min", "2 días, 2 horas"
  completado: boolean;
}

export interface IPedidoSeguimiento {
  id: string; // "MV-8942"
  cliente: string;
  fechaPrometida: string; // "12 de diciembre"
  totalProceso: string; // "2 días, 4 horas"
  estadoGeneral: PedidoEstadoGeneral;
  etapas: IPedidoEtapa[];
}