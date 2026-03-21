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
