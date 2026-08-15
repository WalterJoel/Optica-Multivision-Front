import { IResponseSale } from "@/types/sales";
import { TipoProducto } from "@/commons/constants";

interface ParamsArmarTicket {
  id?: number;
  sedeId: number;
  userId: number;
  nombreVendedor: string;
  cliente?: any;
  cartItems: any[];
  total: number;
  montoPagado: number;
  deuda: number;
  observaciones?: string;
}

export const armarVentaTicket = ({
  id,
  sedeId,
  userId,
  nombreVendedor,
  cliente,
  cartItems,
  total,
  montoPagado,
  deuda,
  observaciones,
}: ParamsArmarTicket): IResponseSale => {
  const ventaId = id || Math.floor(Date.now() / 1000);

  return {
    id: ventaId,
    createdAt: new Date().toISOString(),
    sedeId,
    userId,
    user: { nombre: nombreVendedor, apellido: "" } as any,
    cliente: cliente || null,
    total: total.toFixed(2),
    montoPagado: montoPagado.toFixed(2),
    deuda: deuda.toFixed(2),
    observaciones: observaciones || null,
    productos: cartItems.map((item: any, idx: number) => {
      const precio = Number(item.price || 0);
      const cantidad = Number(item.quantity || 1);
      const descuento = Number(item.discount || 0);
      const subtotal = (precio - descuento) * cantidad;

      return {
        id: idx + 1,
        ventaId,
        productoId: item.productId || item.id,
        stockId: item.isLens ? item.id : null,
        tipoProducto: item.productType || (item.isLens ? TipoProducto.LENTE : TipoProducto.ACCESORIO),
        cantidad,
        precioUnitario: precio.toFixed(2),
        descuento: descuento ? descuento.toFixed(2) : "0",
        subtotal: subtotal.toFixed(2),
        esf: item.esf ? String(item.esf) : null,
        cyl: item.cyl ? String(item.cyl) : null,
        createdAt: new Date().toISOString(),
        stock: item.isLens ? { lente: { marca: item.name } } : null,
        producto: !item.isLens ? { nombre: item.name, montura: item.montura } : null,
      };
    }),
  } as IResponseSale;
};
