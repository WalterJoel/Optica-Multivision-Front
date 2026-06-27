export enum PRODUCTOS {
  LENTE = "LENTE",
  ACCESORIO = "ACCESORIO",
  MONTURA = "MONTURA",
}
export enum TipoProducto {
  LENTE = "LENTE",
  MONTURA = "MONTURA",
  ACCESORIO = "ACCESORIO",
}
export const IMG_LENTE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGnQPr3op1MGXxOFrwPtuxTYNQM_1H3ZLsGA&s";

export enum STATUS_MODAL {
  SUCCESS_MODAL = "success",
  ERROR_MODAL = "error",
}

export const SUCCESS_ICON = "/images/icons/success-modal.png";

// DATOS DE LA EMPRESA
export const LOGO_EMPRESA = "";
export const DIRECCION_EMPRESA = "";
export const CELULAR_EMPRESA = "";

// ✅ CONSTANTES PARA LA VENTA, ❌ NO MODIFICAR, DEBE SER IGUAL EN EL FRONT
// ✅ EN CASO DE AGREGAR ALGUNO, AGREGAR TAMBIEN EL FRONT

export enum TipoVenta {
  CONTADO = "CONTADO",
  CREDITO = "CREDITO",
}

export enum EstadoPago {
  PAGADO = "PAGADO",
  PENDIENTE = "PENDIENTE",
}

export enum MetodoPago {
  EFECTIVO = "EFECTIVO",
  YAPE = "YAPE",
  PLIN = "PLIN",
  TRANSFERENCIA = "TRANSFERENCIA",
}

// ✅ CONSTANTES PARA SEGUIMIENTO DE PEDIDO, ❌ NO MODIFICAR, DEBE SER IGUAL EN EL FRONT

export enum EstadoProceso {
  EN_TALLER = "EN_TALLER",
  LISTO = "LISTO",
  ENTREGADO = "ENTREGADO",
}

export enum EstadoPedido {
  CREADO = "CREADO",
  TALLER = "TALLER",
  TRANSITO = "TRANSITO",
  ENTREGADO = "ENTREGADO",
}

export const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Administrador" },
  { value: "VENDEDOR", label: "Vendedor" },
  { value: "ALMACEN", label: "Almacén" },
  { value: "TALLER", label: "Taller" },
];

export enum ClasificacionMonturas {
  ACETATO = 'ACETATO',
  CAREY = 'CAREY',
  TR90 = 'TR90',
  METAL = 'METAL',
  NIÑOS = 'NIÑOS',
  TITANEO = 'TITANEO',
  PLASTICO = 'PLASTICO',
  MADERA = 'MADERA',
  LECTURA = 'LECTURA',
  OTROS = 'OTROS',
}


export enum ClasificacionAccesorios {
  COFRES_Y_ESTUCHES = 'COFRES_Y_ESTUCHES',
  EQUIPOS_Y_HERRAMIENTAS = 'EQUIPOS_Y_HERRAMIENTAS',
  ACCESORIOS_PARA_OPTICA = 'ACCESORIOS_PARA_OPTICA',
  MOBILIARIO_PARA_OPTICA = 'MOBILIARIO_PARA_OPTICA',
  OTROS = 'OTROS',
}

export enum ClasificacionLentes {
  RESINA = 'RESINA',
  POLICARBONATO = 'POLICARBONATO',
  CRISTAL = 'CRISTAL',
  OTROS = 'OTROS',
}

export enum PrioridadLentes {
  MOSTRAR_PRIMERO = 1,
  MOSTRAR_SEGUNDO = 2,
  MOSTRAR_TERCERO = 3,
  MOSTRAR_CUARTO = 4,
  MOSTRAR_QUINTO = 5,
}