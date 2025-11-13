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
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});
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
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));

    setFilters((prev) => ({
      ...prev,
      category,
      subcategory: undefined,
      size: undefined, // reset size khi đổi category
    }));
  };

  const updateLocalFilters = (newPartialFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newPartialFilters }));
  };

  const handleApplyFilters = () => {
    onFilterChange({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  return (
    <aside className="sidebar">
      <h3>SHOP BY CATEGORIES</h3>
      <ul className="no-bullets">
        {visibleCategories.map((category) => {
          const ref = useRef<HTMLDivElement>(null);

          useEffect(() => {
            const element = ref.current;
            if (element) {
              element.style.maxHeight = openCategories[category.name]
                ? `${element.scrollHeight}px`
                : "0px";
            }
          }, [openCategories[category.name]]);

          return (
            <li key={category.name}>
              <div className="category-header" onClick={() => toggleCategory(category.name)}>
                <span className="category-title">{category.name}</span>
                {category.subcategories.length > 0 && (
                  <span className="ti-wrapper">
                    <i className={`ti-${openCategories[category.name] ? "angle-up" : "angle-down"}`} />
                  </span>
                )}
              </div>

              <div ref={ref} className="subcategory-wrapper">
                <ul className="subcategory-list no-bullets">
                  {category.subcategories.map((sub) => (
                    <li
                      key={sub}
                      className={filters.category === sub ? "active" : ""}
                      onClick={() => {
                        if (category.name === "Sale" && ["Clothing", "Swimwear", "Accessories"].includes(sub)) {
                          setFilters((prev) => ({
                            ...prev,
                            category: sub,
                            subcategory: undefined,
                            size: undefined,
                          }));
                          onFilterChange({
                            ...filters,
                            category: sub,
                            subcategory: undefined,
                            size: undefined,
                            minPrice: priceRange[0],
                            maxPrice: priceRange[1],
                          });
                        } else {
                          setFilters((prev) => ({
                            ...prev,
                            category: category.name,
                            subcategory: String(subcategoryNameToId[sub]),
                            size: undefined,
                          }));
                        }
                      }}
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

      <hr className="section-divider" />

      <h3>SHOP BY PRICE</h3>
      <div className="price-range-container">
        <Range
          step={1}
          min={0}
          max={1000}
          values={priceRange}
          onChange={(values) => setPriceRange([...values] as [number, number])}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                height: "6px",
                background: `linear-gradient(to right, #ccc 0%, #000 ${(priceRange[0] - 70) / 1.8}%, #000 ${(priceRange[1] - 70) / 1.8}%, #ccc 100%)`,
                borderRadius: "4px",
                margin: "20px 0",
                ...props.style,
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                height: "20px",
                width: "20px",
                borderRadius: "50%",
                backgroundColor: "white",
                border: "2px solid white",
                ...props.style,
              }}
            />
          )}
        />
        <div className="price-label">${priceRange[0]} - ${priceRange[1]}</div>
      </div>

      <hr className="section-divider" />

      <h3>SHOP BY COLOR</h3>
<div className="color-filter-container">
  <ul className="color-filter no-bullets">
    {["Blue", "Black", "Green", "Pink", "Red", "Brown", "Yellow", "Purple","White"].map(
      (color) => (
        <li
          key={color}
          onClick={() =>
            updateLocalFilters({
              color: filters.color === color ? undefined : color, // Toggle chọn/bỏ
            })
          }
          className={filters.color === color ? "active" : ""}
        >
          <span className={`color-box ${color.toLowerCase().replace(/\s/g, "-")}`} />
          {color}
        </li>
      )
    )}
  </ul>
</div>


      {filters.category && (
        <>
          <hr className="section-divider" />
          <h3>SHOP BY SIZE</h3>
          <ul className="size-filter no-bullets">
            {(categorySizes[filters.category] || []).map((size) => (
              <li key={size} className="size-item" onClick={() => updateLocalFilters({ size })}>
                <span className="size-label">{size}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <hr className="section-divider" />

      <button className="filter-btn" onClick={handleApplyFilters}>
        Apply Filter
      </button>
    </aside>
  );
};

export default Sidebar;