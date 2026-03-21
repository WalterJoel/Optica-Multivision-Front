export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  discountId: number | null; // ID desde la tabla descuentos, null sino tiene
  discount: number; // Un unico descuento por producto
  title: string;
  cyl: number;
  esf: number;
  isLens: boolean;
  price: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
}
