

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "../style/RelatedProduct.css";
import ProductCard from "./ProductCard";
// import { fetchRelatedProducts, Product } from "../../api/products";

interface RelatedProductsProps {
  excludeName: string;
  category?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  excludeName,
  category,
}) => {
  const [page, setPage] = useState(1);
  const limit = 4;

  const { data, isLoading, error } = useQuery({
    queryKey: ["relatedProducts", excludeName, category, page],
    queryFn: () => fetchRelatedProducts(excludeName, category, page, limit),
    enabled: !!excludeName,
  });

  const relatedProducts = data?.products || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  if (relatedProducts.length === 0 && !isLoading) return null;

  return (
    <div className="related-products">
      <h2>Related Products</h2>
      {isLoading ? (
        <div>Loading related products...</div>
      ) : error ? (
        <div>Error loading related products: {(error as Error).message}</div>
      ) : (
        <>
          <div className="related-products-grid">
            {relatedProducts.map((item: Product) => (
              <Link
                key={item.Id}
                to={`/product/${item.Id}`}
                className="product-card-link"
              >
                <ProductCard
                  product={{
                    id: item.Id,
                    name: item.Name,
                    img: item.Img,
                    price: item.Price,
                  }}
                  onBuy={() => console.log(`Buying product: ${item.Name}`)}
                />
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination-dots">
              {Array.from({ length: totalPages }).map((_, index) => (
                <span
                  key={index}
                  className={`dot ${page === index + 1 ? "active" : ""}`}
                  onClick={() => setPage(index + 1)}
                ></span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RelatedProducts;