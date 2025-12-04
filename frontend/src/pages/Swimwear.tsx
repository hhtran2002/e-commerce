import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../component/ProductList";
import FilteredProductList from "../component/FilteredProductList";
import Sidebar, { FilterOptions } from "../component/Sidebar";
import Breadcrumb from "../component/Breadcrumb";
import "../style/CategoryPage.css";
import Pagination from "../component/Pagination";

// Ánh xạ slug URL -> id category / subcategory
const mapCategoryToId = (category: string): number | null => {
  const map: Record<string, number> = {
    swimwear: 0,     // parent (nếu có id riêng thì thay 0 bằng id thật)
    bikinis: 20,
    "cover-up": 21,
    "one-piece": 22,
    pareo: 23,
  };
  return map[category.toLowerCase()] ?? null;
};

// Danh sách category id cần hiển thị trong trang Swimwear
const swimwearSubcategoryIds = [20, 21, 22, 23];

const Swimwear: React.FC = () => {
  const { category } = useParams();
  const categoryIdFromUrl = category ? mapCategoryToId(category) : null;

  const categoryIdsToUse =
    categoryIdFromUrl !== null ? [categoryIdFromUrl] : swimwearSubcategoryIds;

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
    setFilters({});
    setIsFiltering(false);
  }, [category]);

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
        <Sidebar
          onFilterChange={handleFilterChange}
          allowedCategories={["Swimwear"]}
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
                parentCategoryId={0} // nếu có parent thực sự thì đổi 0 thành id đó
                allowedSubcategoryIds={swimwearSubcategoryIds}
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

export default Swimwear;
