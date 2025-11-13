import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../component/ProductList";
import FilteredProductList from "../component/FilteredProductList";
import Sidebar, { FilterOptions } from "../component/Sidebar";
import Breadcrumb from "../component/Breadcrumb";
import "../style/CategoryPage.css";
import Pagination from "../component/Pagination";
// Ánh xạ tên danh mục URL sang ID
const mapCategoryToId = (category: string): number | null => {
  const map: Record<string, number> = {
    clothing: 1,
    blazer: 4,
    cardigan: 5,
    skirt: 6,
    jacket: 7,
    dress: 8,
    denim: 11,
    shorts: 13,
  };
  return map[category.toLowerCase()] ?? null;
};

// Danh sách các danh mục con của Clothing (parentId = 1)
const clothingSubcategoryIds = [1,4, 5, 6, 7, 8, 11, 13];


const ClothingPage: React.FC = () => {
  const clothingCategoryIds = [1, 4, 5, 6, 7, 8, 11];
  const { category } = useParams();
  const categoryIdFromUrl = category ? mapCategoryToId(category) : null;

  const categoryIdsToUse =
    categoryIdFromUrl !== null ? [categoryIdFromUrl] : clothingSubcategoryIds;


  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setIsFiltering(true);
    setPage(1); // reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setIsFiltering(false);
    setPage(1); // reset to first page
  };

  // Compute total pages
  const totalPages = Math.ceil(totalCount / limit);
  // Reset bộ lọc mỗi khi URL category thay đổi
  useEffect(() => {
    setFilters({});
    setIsFiltering(false);
  }, [category]);

  // Nếu URL sai danh mục (không khớp trong map)
  if (category && categoryIdFromUrl === null) {
    return (
      <main className="clothing-page">
        <Breadcrumb title="Clothing" />
        <p style={{ padding: 24 }}>No matching categories found.</p>
      </main>
    );
  }

  return (
    <main className="clothing-page">
      <Breadcrumb title="Clothing" />
      <div className="content-container">
        <Sidebar
          onFilterChange={handleFilterChange}
          allowedCategories={["Clothing"]}
        />

        <div className="right-content">
          {isFiltering && (
            <div style={{ marginBottom: 16, textAlign: "right" }}>
              <button className="filter-btn" onClick={handleClearFilters}>
                Delete Filter
              </button>
            </div>
          )}

          <div className="clothing-wrapper">
            {isFiltering ? (
              <FilteredProductList
                filters={filters}
                parentCategoryId={1}
                allowedSubcategoryIds={[1,4, 5, 6, 7, 8, 11]}
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