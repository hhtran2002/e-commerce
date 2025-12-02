import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../component/ProductList";
import FilteredProductList from "../component/FilteredProductList";
import Sidebar, { FilterOptions } from "../component/Sidebar";
import Breadcrumb from "../component/Breadcrumb";
import "../style/CategoryPage.css";
import Pagination from "../component/Pagination";

// map slug URL -> id category trong DB
const mapCategoryToId = (category: string): number | null => {
  const map: Record<string, number> = {
    clothing: 1,   // category cha
    blazer: 4,
    bodysuit: 5,
    bottom: 6,
    jacket: 7,
    dress: 8,
    denim: 11,
    jumpsuit: 10,
    knitwear: 11,
    loungewear: 12,
    shorts: 13,
    skirt: 14,     // nếu có id riêng thì sửa cho đúng
    top: 15,
  };

  return map[category.toLowerCase()] ?? null;
};

// danh sách tất cả category con của Clothing
const clothingSubcategoryIds = [4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15];

const ClothingPage: React.FC = () => {
  const { category } = useParams();
  const categoryIdFromUrl = category ? mapCategoryToId(category) : null;

  // nếu có slug hợp lệ -> 1 id; nếu không có slug -> toàn bộ clothing
  const categoryIdsToUse =
    categoryIdFromUrl !== null ? [categoryIdFromUrl] : clothingSubcategoryIds;

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);

  // Filter
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setIsFiltering(true);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setIsFiltering(false);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    // đổi slug -> reset filter
    setFilters({});
    setIsFiltering(false);
  }, [category]);

  // slug không nằm trong map -> báo lỗi, KHÔNG gọi ProductList
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
        <Sidebar
          onFilterChange={handleFilterChange}
          allowedCategories={["Clothing"]}
        />

        <div className="right-content">
          {isFiltering && (
            <div className="filter-bar">
              <button className="filter-btn" onClick={handleClearFilters}>
                Delete Filter
              </button>
            </div>
          )}

          <div className="category-products-wrapper">
            {isFiltering ? (
              <FilteredProductList
                filters={filters}
                parentCategoryId={1}
                allowedSubcategoryIds={clothingSubcategoryIds}
                page={page}
                limit={limit}
                onTotalCountChange={setTotalCount}
              />
            ) : (
              <ProductList
                categoryIds={categoryIdsToUse}
                page={page}
                limit={limit}
                onTotalCountChange={setTotalCount}
              />
            )}
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
