export interface ICreateDiscount {
  clienteId: number;
  productoId: number;
  serie?: number;
  montoDescuento: number;
  tipoProducto: string;
}

export interface ISeries {
  id: number;
  nombre: string;
  value: number;
  precio: number;
  descuento: number;
  icono: string;
}

export interface IResponseDiscountByProduct {
  id: number;
  productoId: number;
  nombreProducto: string;
  esLente: boolean;
  serie: number;
  montoDescuento: number;
}
