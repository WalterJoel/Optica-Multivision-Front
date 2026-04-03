interface IUpdateStockProducto {
  stockId: number;
  cantidad: number;
}

export type IUpdateStockProductos = {
  items: IUpdateStockProducto[];
};
