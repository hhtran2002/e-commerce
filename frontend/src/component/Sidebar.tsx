import React, { useState, useRef, useEffect } from "react";
import { Range } from "react-range";
import "../style/Sidebar.css";

export type FilterOptions = {
  category?: string;
  subcategory?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
};

type SidebarProps = {
  onFilterChange: (filters: FilterOptions) => void;
  allowedCategories?: string[];
};

const subcategoryNameToId: Record<string, number> = {
  Blazers: 4,
  Cardigan: 5,
  Skirt: 6,
  Jacket: 7,
  Dress: 8,
  Denim: 11,
  Jewelry: 9,
  ShoesAndBags: 10,
  Bikinis: 20,
  "Cover up": 21,
  "One piece": 22,
  Pareo: 23,
};

const categorySizes: Record<string, string[]> = {
  Clothing: ["XS", "S", "M", "L", "XL"],
  Accessories: ["37", "38", "39", "40", "41"],
  Swimwear: ["S", "M", "L"],
};

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange, allowedCategories }) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<FilterOptions>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([70, 1000]);

  const categories = [
    { name: "Accessories", subcategories: ["ShoesAndBags", "Jewelry"] },
    { name: "Clothing", subcategories: ["Blazers", "Cardigan", "Skirt", "Jacket", "Dress", "Denim"] },
    { name: "Swimwear", subcategories: ["Bikinis", "Cover up", "One piece", "Pareo"] },
    { name: "Sale", subcategories: ["Clothing", "Swimwear", "Accessories"] },
  ];

  const visibleCategories = allowedCategories
    ? categories.filter((c) => allowedCategories.includes(c.name))
    : categories;

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
    setFilters((prev) => ({ ...prev, category, subcategory: undefined, size: undefined }));
  };

  const applyFilters = () => {
    onFilterChange({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">SHOP BY CATEGORIES</h3>

      <ul className="category-list">
        {visibleCategories.map((category) => {
          const ref = useRef<HTMLDivElement>(null);

          useEffect(() => {
            if (ref.current) {
              ref.current.style.maxHeight = openCategories[category.name]
                ? `${ref.current.scrollHeight}px`
                : "0px";
            }
          }, [openCategories[category.name]]);

          return (
            <li key={category.name}>
              <div className="category-header" onClick={() => toggleCategory(category.name)}>
                <span>{category.name}</span>
                <i className={`ti-${openCategories[category.name] ? "angle-up" : "angle-down"}`} />
              </div>

              <div ref={ref} className="subcategory-wrapper">
                <ul className="subcategory-list">
                  {category.subcategories.map((sub) => (
                    <li
                      key={sub}
                      className={filters.subcategory === String(subcategoryNameToId[sub]) ? "active" : ""}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          category: category.name,
                          subcategory: String(subcategoryNameToId[sub]),
                          size: undefined,
                        }))
                      }
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      <hr />

      <h3 className="sidebar-title">SHOP BY PRICE</h3>
      <div className="price-section">
        <Range
          step={1}
          min={0}
          max={1000}
          values={priceRange}
          onChange={(values) => setPriceRange(values as [number, number])}
          renderTrack={({ props, children }) => (
            <div {...props} className="price-track">
              {children}
            </div>
          )}
          renderThumb={({ props }) => <div {...props} className="price-thumb" />}
        />
        <div className="price-label">
          ${priceRange[0]} - ${priceRange[1]}
        </div>
      </div>

      <hr />

      <h3 className="sidebar-title">SHOP BY COLOR</h3>
      <ul className="color-list">
        {["Blue", "Black", "Green", "Pink", "Red", "Brown", "Yellow", "Purple", "White"].map((color) => (
          <li
            key={color}
            className={filters.color === color ? "active" : ""}
            onClick={() => setFilters((prev) => ({ ...prev, color }))}
          >
            <span className={`color-box ${color.toLowerCase()}`} />
            {color}
          </li>
        ))}
      </ul>

      {filters.category && (
        <>
          <hr />
          <h3 className="sidebar-title">SHOP BY SIZE</h3>
          <ul className="size-list">
            {(categorySizes[filters.category] || []).map((size) => (
              <li key={size} onClick={() => setFilters((prev) => ({ ...prev, size }))}>
                {size}
              </li>
            ))}
          </ul>
        </>
      )}

      <button className="apply-btn" onClick={applyFilters}>
        Apply Filter
      </button>
    </aside>
  );
};

export default Sidebar;
