import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "../styles/ProductList.css";

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  stockQuantity: number;
  category: {
    id: number;
    name: string;
  };
}

interface ProductListProps {
  categoryId: number; // sửa thành một categoryId duy nhất
}

const ProductList: React.FC<ProductListProps> = ({ categoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/category/${categoryId}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.data || []); // data.data chứa danh sách sản phẩm
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (loading) return <p>Loading products...</p>;
  if (products.length === 0) return <p>No products found.</p>;

  return (
    <div className="product-list">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={{
            id: p.id,
            name: p.name,
            img: "/fallback.jpg", // tạm thời dùng ảnh mặc định
            price: p.price,
          }}
        />
      ))}
    </div>
  );
};

export default ProductList;
