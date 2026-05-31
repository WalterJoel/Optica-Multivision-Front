import { TipoProducto } from "@/commons/constants";

export interface CartItem {
  id: number;
  productId: number | null; //Null cuando es lente no tiene producto
  productName: string;
  productType: TipoProducto;
  discount?: number | null; // Un unico descuento por producto
  cyl?: number | null;
  esf?: number | null;
  isLens: boolean;
  price: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
}
