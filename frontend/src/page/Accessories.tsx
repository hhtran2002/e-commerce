import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../component/ProductList";
import FilteredProductList from "../component/FilteredProductList";
import Sidebar, { FilterOptions } from "../component/Sidebar";
import Breadcrumb from "../component/Breadcrumb";
import "../style/CategoryPage.css";
import Pagination from "../component/Pagination";

// Ánh xạ slug URL -> id
const mapCategoryToId = (category: string): number | null => {
  const map: Record<string, number> = {
    accessories: 0,   // parent accessories, nếu có id riêng hãy thay
    "shoes-and-bags": 10,
    jewelry: 9,
  };
  return map[category.toLowerCase()] ?? null;
};

const accessoriesSubcategoryIds = [9, 10];

const AccessoriesPage: React.FC = () => {
  const { category } = useParams();
  const categoryIdFromUrl = category ? mapCategoryToId(category) : null;

  const categoryIdsToUse =
    categoryIdFromUrl !== null ? [categoryIdFromUrl] : accessoriesSubcategoryIds;

  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);

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
        <Sidebar
          onFilterChange={handleFilterChange}
          allowedCategories={["Accessories"]}
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
                parentCategoryId={0}
                allowedSubcategoryIds={accessoriesSubcategoryIds}
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

export default AccessoriesPage;
