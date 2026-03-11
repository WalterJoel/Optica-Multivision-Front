import {
  IPedidoSeguimiento,
  IPedidoEtapa
} from "@/types/seguimiento-pedido";
export const pedidosMock: IPedidoSeguimiento[] = [
  {
    id: "MV-8942",
    cliente: "Carlos Mendoza",
    fechaPrometida: "12 de diciembre",
    totalProceso: "2 días, 4 horas",
    estadoGeneral: "DENTRO",
    etapas: [
      { key: "ALMACEN", label: "En Almacén", tiempo: "15 min", completado: true },
      { key: "TALLER", label: "En Taller", tiempo: "15 min", completado: true },
      { key: "TRANSITO", label: "En Tránsito", tiempo: "2 días, 2 horas", completado: false },
      { key: "ENTREGA", label: "Entrega", tiempo: "6 horas", completado: false },
    ],
  },
  {
    id: "MV-8943",
    cliente: "Ana López",
    fechaPrometida: "13 de diciembre",
    totalProceso: "1 día, 6 horas",
    estadoGeneral: "RETRASADO",
    etapas: [
      { key: "ALMACEN", label: "En Almacén", tiempo: "40 min", completado: true },
      { key: "TALLER", label: "En Taller", tiempo: "1 día, 2 horas", completado: false },
      { key: "TRANSITO", label: "En Tránsito", tiempo: "—", completado: false },
      { key: "ENTREGA", label: "Entrega", tiempo: "—", completado: false },
    ],
  },
];