import React from "react";
import { Link } from "react-router-dom";
import "../style/Categories.css";

type Category = {
  key: "clothing" | "swimwear" | "accessories" | "sale" | "denim" | "skirts";
  label: string;
  imageUrl: string;
  to: string; // route
};

const defaults: Category[] = [
  { key: "clothing",   label: "DRESSES",    imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/CHARLI6.webp",   to: "/clothing" },
  { key: "clothing",   label: "TOPS",       imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/CHARLI6.webp",      to: "/clothing" },
  { key: "clothing",   label: "DENIM",      imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/CHARLI6.webp",     to: "/clothing" },
  { key: "swimwear",   label: "SWIMWEAR",   imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/CHARLI6.webp",      to: "/swimwear" },
  { key: "clothing",   label: "SKIRTS",     imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/CHARLI6.webp",    to: "/clothing" },
  { key: "accessories",label: "ACCESSORIES",imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/CHARLI6.webp",to: "/accessories" },
  // nếu muốn có SALE riêng: { key: "sale", label: "SALE", imageUrl: "/cat-sale.jpg", to: "/sale" },
];

type Props = { title?: string; items?: Category[] };

const Categories: React.FC<Props> = ({ title = "CATEGORIES", items = defaults }) => {
  return (
    <section className="cats-section">
      <div className="cats-container">
        <h2 className="cats-title">{title}</h2>
        <div className="cats-grid">
          {items.map((c, i) => (
            <Link to={c.to} className="cat-card" key={i} aria-label={c.label}>
              <img src={c.imageUrl} alt={c.label} loading="lazy" />
              <span className="cat-label">{c.label}</span>
              <span className="cat-overlay" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
