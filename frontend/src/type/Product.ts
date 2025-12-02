export type ProductType = {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  stockQuantity: number;
  category: {
    id: number;
    name: string;
  };
  items: {
    id: number;
    size?: any;
    color?: any;
    images: { imageUrl: string }[];
  }[];
};
