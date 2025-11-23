import React, { useRef } from "react";
import "../style/NewArrivals.css";

export type Product = {
  id: string | number;
  name: string;
  price: number;
  imageUrl: string;
  isNew?: boolean;
};

type Props = {
  products: Product[];
  title?: string;
};

const NewArrivals: React.FC<Props> = ({ products, title = "New Arrivals" }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByOneViewport = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = dir === "left" ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="na-section">
      <div className="na-container">
        <h2 className="na-title">{title}</h2>

        <button className="na-arrow na-left" onClick={() => scrollByOneViewport("left")} aria-label="Prev">
          ‹
        </button>
        <button className="na-arrow na-right" onClick={() => scrollByOneViewport("right")} aria-label="Next">
          ›
        </button>

        <div className="na-track" ref={trackRef}>
          {products.map((p) => (
            <div className="na-card" key={p.id}>
              <div className="na-image-wrap">
                {p.isNew && <span className="na-badge">NEW</span>}
                <img src={p.imageUrl} alt={p.name} loading="lazy" />
              </div>
              <div className="na-info">
                <h3 className="na-name">{p.name}</h3>
                <div className="na-price">
                  {p.price.toFixed(2)} <span className="na-currency">$</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
