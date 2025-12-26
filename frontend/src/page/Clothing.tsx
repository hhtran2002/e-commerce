import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../component/ProductList";
import Breadcrumb from "../component/Breadcrumb";
import Pagination from "../component/Pagination";
import "../style/CategoryPage.css";

// map slug URL -> id category trong DB
const mapCategoryToId = (category: string): number | null => {
  const map: Record<string, number> = {
    clothing: 1,   // category cha
    blazer: 4,
    bodysuit: 5,
    bottom: 6,
    jacket: 7,
    dress: 8,
    jumpsuit: 10,
    denim: 11,
    knitwear: 11,
    loungewear: 12,
    shorts: 13,
    skirt: 14,
    top: 15,
  };

  return map[category.toLowerCase()] ?? null;
};

// danh sách tất cả category con của Clothing
const clothingSubcategoryIds = [4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15];

const ClothingPage: React.FC = () => {
  const { category } = useParams();
  const categoryIdFromUrl = category ? mapCategoryToId(category) : null;

  // nếu có slug hợp lệ -> chỉ lấy category đó
  // nếu không có slug -> lấy toàn bộ clothing
  const categoryIdsToUse =
    categoryIdFromUrl !== null ? [categoryIdFromUrl] : clothingSubcategoryIds;

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / limit);

  // slug không nằm trong map -> báo lỗi
  if (category && categoryIdFromUrl === null) {
    return (
      <main className="category-page clothing-page">
        <Breadcrumb title="Clothing" />
        <p style={{ padding: 24 }}>No matching categories found.</p>
      </main>
    );
  }

  return (
    <main className="category-page clothing-page">
      <Breadcrumb title="Clothing" />

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

export default ClothingPage;
