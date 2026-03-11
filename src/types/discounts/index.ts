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
