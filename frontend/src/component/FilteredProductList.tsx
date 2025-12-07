import React, { useEffect, useState } from "react";
import "../style/FilteredProductList.css";
import ProductCard from "./ProductCard";
import ShoppingCartPopup from "../component/ShoppingCartPopup";
import { useCart } from "../context/CartContext";
import { FilterOptions } from "./Sidebar";

export type ProductItem = {
  id: number; // id của product_item
  price: number;
  size?: string;
  color?: { name: string };
  images: { image_url?: string }[];
  product: {
    id: number; // ✅ id của product
    name: string;
    category_id: number;
    productPromotions?: any[];
  };
};

interface FilteredProductListProps {
  filters: FilterOptions;
  parentCategoryId: number;
  allowedSubcategoryIds?: number[];
  page: number;
  limit: number;
  onTotalCountChange?: (n: number) => void;
}

const FilteredProductList: React.FC<FilteredProductListProps> = ({
  filters,
  parentCategoryId,
  allowedSubcategoryIds,
  page,
  limit,
  onTotalCountChange,
}) => {
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, addToCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/product-items");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: ProductItem[] = await res.json();

        const validItems = data.filter(
          (item) =>
            item &&
            item.product &&
            typeof item.product.category_id === "number"
        );

        let filtered = filters.subcategory
          ? validItems.filter(
              (item) => item.product.category_id === Number(filters.subcategory)
            )
          : validItems.filter(
              (item) =>
                item.product.category_id === parentCategoryId ||
                allowedSubcategoryIds?.includes(item.product.category_id)
            );

        if (filters.minPrice)
          filtered = filtered.filter(
            (item) => item.price >= Number(filters.minPrice)
          );
        if (filters.maxPrice)
          filtered = filtered.filter(
            (item) => item.price <= Number(filters.maxPrice)
          );
        if (filters.color)
          filtered = filtered.filter(
            (item) =>
              item.color?.name?.toLowerCase() ===
              filters.color!.toLowerCase()
          );
        if (filters.size)
          filtered = filtered.filter(
            (item) =>
              item.size?.toLowerCase() === filters.size!.toLowerCase()
          );

        setProductItems(filtered);
        onTotalCountChange?.(filtered.length);
      } catch (err) {
        console.error("Error loading filtered products:", err);
      }
    })();
  }, [filters, parentCategoryId, allowedSubcategoryIds, onTotalCountChange]);

  const start = (page - 1) * limit;
  const currentItems = productItems.slice(start, start + limit);

  const handleBuyNow = (item: ProductItem) => {
    const image = item.images?.[0];
    const imageUrl = image?.image_url || "/fallback.jpg";

    let discountRate = 0;
    let newPrice = item.price;
    let isOnSale = false;

    if (item.product && item.product.productPromotions) {
      const now = new Date();
      const validPromotion = item.product.productPromotions.find(
        (pp: any) =>
          pp.promotion &&
          pp.promotion.discount_rate > 0 &&
          new Date(pp.promotion.start_at) <= now &&
          new Date(pp.promotion.end_at) >= now
      );
      if (validPromotion) {
        discountRate = validPromotion.promotion.discount_rate;
        newPrice = Math.round(item.price * (1 - discountRate));
        isOnSale = true;
      }
    }

    // ✅ dùng product.id làm id cho cart
    addToCart({
      id: item.product.id,
      name: item.product.name,
      price: newPrice,
      image: imageUrl,
    });

    setIsCartOpen(true);
  };

  return (
    <div className="product-list-container">
      <div className="product-container">
        {currentItems.length === 0 ? (
          <p className="no-product">No matching products found.</p>
        ) : (
          currentItems.map((item) => {
            const image = item.images?.[0];
            const imageUrl = image?.image_url || "/fallback.jpg";

            let discountRate = 0;
            let newPrice = item.price;
            let isOnSale = false;

            if (item.product && item.product.productPromotions) {
              const now = new Date();
              const validPromotion = item.product.productPromotions.find(
                (pp: any) =>
                  pp.promotion &&
                  pp.promotion.discount_rate > 0 &&
                  new Date(pp.promotion.start_at) <= now &&
                  new Date(pp.promotion.end_at) >= now
              );

              if (validPromotion) {
                discountRate = validPromotion.promotion.discount_rate;
                newPrice = Math.round(item.price * (1 - discountRate));
                isOnSale = true;
              }
            }

            return (
              <div className="product-item" key={item.id}>
                <ProductCard
                  product={{
                    id: item.product.id, // ✅ dùng product.id cho trang /product/:id
                    name: item.product.name,
                    img: imageUrl,
                    price: newPrice,
                    discountPrice: isOnSale ? item.price : undefined,
                    isOnSale,
                  }}
                  onBuy={() => handleBuyNow(item)}
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

export default FilteredProductList;
