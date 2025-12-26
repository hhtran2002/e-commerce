import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../component/ProductList";
import Breadcrumb from "../component/Breadcrumb";
import "../style/CategoryPage.css";
import Pagination from "../component/Pagination";

// Map slug URL -> categoryId
const mapCategoryToId = (category: string): number | null => {
  const map: Record<string, number> = {
    accessories: 0,
    "shoes-and-bags": 10,
    jewelry: 9,
  };
  return map[category.toLowerCase()] ?? null;
};

// Accessories gồm nhiều sub-category
const accessoriesSubcategoryIds = [9, 10];

const Accessories: React.FC = () => {
  const { category } = useParams();

  const categoryIdFromUrl = category ? mapCategoryToId(category) : null;

  // Nếu có slug hợp lệ → dùng 1 category
  // Không có slug → load toàn bộ accessories
  const categoryIdsToUse =
    categoryIdFromUrl !== null
      ? [categoryIdFromUrl]
      : accessoriesSubcategoryIds;

  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / limit);

  // Slug không hợp lệ
  if (category && categoryIdFromUrl === null) {
    return (
      <main className="category-page accessories-page">
        <Breadcrumb title="Accessories" />
        <p style={{ padding: 24 }}>No matching categories found.</p>
      </main>
    );
  }

  return (
    <main className="category-page accessories-page">
      <Breadcrumb title="Accessories" />

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

export default Accessories;
