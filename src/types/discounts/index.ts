export interface ICreateDiscount {
  clienteId: number;
  productoId: number;
  serie?: number;
  montoDescuento: number;
  tipoProducto: string;
}
