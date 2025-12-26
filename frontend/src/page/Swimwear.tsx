import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../component/ProductList";
import Breadcrumb from "../component/Breadcrumb";
import Pagination from "../component/Pagination";
import "../style/CategoryPage.css";

// Ánh xạ slug URL -> id category / subcategory
const mapCategoryToId = (category: string): number | null => {
  const map: Record<string, number> = {
    swimwear: 0,     // parent (nếu có id riêng thì thay cho đúng)
    bikinis: 20,
    "cover-up": 21,
    "one-piece": 22,
    pareo: 23,
  };
  return map[category.toLowerCase()] ?? null;
};

// Danh sách category con của Swimwear
const swimwearSubcategoryIds = [20, 21, 22, 23];

const Swimwear: React.FC = () => {
  const { category } = useParams();
  const categoryIdFromUrl = category ? mapCategoryToId(category) : null;

  // Nếu có slug hợp lệ → lấy đúng category
  // Nếu không có slug → lấy toàn bộ swimwear
  const categoryIdsToUse =
    categoryIdFromUrl !== null ? [categoryIdFromUrl] : swimwearSubcategoryIds;

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / limit);

  // URL category không hợp lệ
  if (category && categoryIdFromUrl === null) {
    return (
      <main className="category-page swimwear-page">
        <Breadcrumb title="Swimwear" />
        <p style={{ padding: 24 }}>No matching categories found.</p>
      </main>
    );
  }

  return (
    <main className="category-page swimwear-page">
      <Breadcrumb title="Swimwear" />

      <div className="content-container">
        <div className="right-content">
          <div className="category-products-wrapper">
            <ProductList
              categoryIds={categoryIdsToUse}
              page={page}
              limit={limit}
              onTotalCountChange={setTotalCount}
            />
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Swimwear;
