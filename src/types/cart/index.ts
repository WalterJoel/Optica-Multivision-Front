export interface CartItem {
  id: number;
  productId: number;
  productName: string;
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
