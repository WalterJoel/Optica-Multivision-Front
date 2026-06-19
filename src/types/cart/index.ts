import { TipoProducto } from "@/commons/constants";

export interface CartItem {
  id: number;
  productId: number | null; //Null cuando es lente no tiene producto
  lenteId?: number | null;
  productName: string;
  productType: TipoProducto;
  discount?: number | null; // Un unico descuento por producto
  cyl?: number | null;
  esf?: number | null;
  isLens: boolean;
  price: number;
  quantity: number;
  stock?: number;
  imagenUrl?: string | null;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
}
