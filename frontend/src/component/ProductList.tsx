import React, { useEffect, useState } from "react";
import "../style/ProductList.css";
import ProductCard from "./ProductCard";
import ShoppingCartPopup from "../component/ShoppingCartPopup";
import { useCart } from "../context/CartContext";

export type Product = {
  id: number;
  name: string;
  price: number;
  items: {
    id: number;
    images: { imageUrl?: string }[];
    size?: any;
    color?: any;
  }[];
  category: { id: number; name: string };
};

interface ProductListProps {
  // Có thể truyền 0, 1 hoặc nhiều categoryId
  categoryIds: number[];
  page: number;
  limit: number;
  onTotalCountChange?: (n: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  categoryIds,
  page,
  limit,
  onTotalCountChange,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, addToCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "";

        if (!categoryIds || categoryIds.length === 0) {
          // Không truyền category → lấy tất cả
          url = `http://localhost:3000/api/products`;
        } else if (categoryIds.length === 1) {
          // 1 category
          url = `http://localhost:3000/api/products/category/${categoryIds[0]}`;
        } else {
          // Nhiều category → dùng /categories?ids=1,5,6,...
          const idsQuery = categoryIds.join(",");
          url = `http://localhost:3000/api/products/categories?ids=${idsQuery}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
        onTotalCountChange?.(data.length);
      } catch (err) {
        console.error("Error loading products:", err);
        setProducts([]);
        onTotalCountChange?.(0);
      }
    };

    fetchProducts();
  }, [categoryIds, page, limit, onTotalCountChange]);

  const handleBuyNow = (p: Product) => {
    const firstItem = p.items[0];
    const imageUrl = firstItem?.images?.[0]?.imageUrl || "/fallback.jpg";

    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: imageUrl,
    });

    setIsCartOpen(true);
  };

  return (
    <div className="product-list-container">
      <div className="product-container">
        {products.length === 0 ? (
          <p className="no-product">No matching products found.</p>
        ) : (
          products.map((p) => {
            const firstItem = p.items[0];
            const imageUrl =
              firstItem?.images?.[0]?.imageUrl || "/fallback.jpg";

            return (
              <div className="product-item" key={p.id}>
                <ProductCard
                  product={{
                    id: p.id,
                    name: p.name,
                    img: imageUrl,
                    price: p.price,
                    discountPrice: p.price, // sau này có sale thì cập nhật
                    isOnSale: false,
                  }}
                  onBuy={() => handleBuyNow(p)}
                />
              </div>
            );
          })
        )}
      </div>

      <ShoppingCartPopup
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </div>
  );
};

export default ProductList;
