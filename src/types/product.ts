export type Product = {
  title: string;
  reviews: number;
  price: number;
  id: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};
