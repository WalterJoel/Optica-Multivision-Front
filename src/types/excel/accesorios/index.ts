export interface AccesorioExcelRow {
  PRODUCTOID: number;
  CODIGO: string;
  NOMBRE: string;
  "PRECIO COMPRA": string | number;
  "PRECIO VENTA": string | number;
  COLOR: string;
  CLASIFICACION?: string;
  CANTIDAD: number;
  TIPO: string;
  SEDE: string;
  "SEDE DESTINO ID"?: number;
}
