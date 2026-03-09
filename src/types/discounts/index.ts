export interface ICreateDiscount {
  clienteId: number;
  productoId: number;
  serie?: string;
  montoDescuento: number;
  tipoProducto: string;
}
