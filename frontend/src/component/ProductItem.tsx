import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../style/ProductItem.css";
import { useCart } from "../context/CartContext";

const ProductItem: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "description" | "additional" | "reviews"
  >("description");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/products/${productId}`
        );
        if (!res.ok) throw new Error("Failed to fetch product details");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  // item đầu tiên để lấy ảnh / color / size
  const firstItem = product.items?.[0];
  const images = firstItem?.images || [];

  const imageUrl = (img: any) =>
    img?.cloudinary_url || img?.imageUrl || img?.image_url || "/fallback.jpg";

  // ✅ Tạo object đưa vào giỏ: dùng product.id cho thống nhất
  const buildCartItem = () => {
    const img = images[currentImage] || images[0] || null;

    return {
      id: product.id, // ❗ luôn dùng product.id
      name: product.name || `Product #${product.id}`,
      price: Number(product.price) || 0,
      image: img ? imageUrl(img) : "/fallback.jpg",
    };
  };

  const handleAddToCart = () => {
    const item = buildCartItem();
    addToCart(item, quantity);
    navigate("/cart");
  };

  const handleBuyNow = () => {
    const item = buildCartItem();
    addToCart(item, quantity);
    navigate("/checkout");
  };

  return (
    <div className="product-page">
      <div className="product-main">
        {/* LEFT: Hình ảnh */}
        <div className="product-images">
          <div className="thumbnail-gallery">
            {images.map((img: any, index: number) => (
              <img
                key={index}
                src={imageUrl(img)}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${
                  currentImage === index ? "active" : ""
                }`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
          <div className="main-image">
            {images.length > 0 ? (
              <img src={imageUrl(images[currentImage])} alt="Product" />
            ) : (
              <img src="/fallback.jpg" alt="Product" />
            )}
          </div>
        </div>

        {/* RIGHT: Thông tin sản phẩm */}
        <div className="product-details">
          <div className="breadcrumb">
            <Link to="/">Home</Link> &nbsp;/&nbsp;
            <span>{product.category?.name || "Category"}</span>
          </div>

          <h1>{product.name || `Product #${product.id}`}</h1>

          <p className="price">
            {product.price?.toLocaleString
              ? product.price.toLocaleString()
              : product.price}
            ₫
          </p>

          <p className="description">
            Color: {firstItem?.color?.name || "N/A"} — Quantity available:{" "}
            {firstItem?.quantity ?? "N/A"}
          </p>

          <div className="color-selection">
            <span>Color: </span>
            <div
              className="color-circle"
              style={{
                backgroundColor: firstItem?.color?.color_code || "#ccc",
              }}
            ></div>
          </div>

          {firstItem?.size && (
            <div className="size-selection">
              <span>Size: </span>
              <button className="size-button">
                {firstItem.size.name || firstItem.size || "N/A"}
              </button>
            </div>
          )}

          <div className="quantity-selection">
            <button
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
            >
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart" onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <button className="buy-now" onClick={handleBuyNow}>
              BUY NOW
            </button>
          </div>

          <div className="product-meta">
            <p>SKU: N/A</p>
            <p>Category: {product.category?.name || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "description" ? "active" : ""}`}
          onClick={() => setActiveTab("description")}
        >
          DESCRIPTION
        </button>
        <button
          className={`tab ${activeTab === "additional" ? "active" : ""}`}
          onClick={() => setActiveTab("additional")}
        >
          ADDITIONAL INFORMATION
        </button>
        <button
          className={`tab ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          REVIEWS (0)
        </button>
      </div>

      {activeTab === "description" && (
        <div className="tab-content">
          <p>Thông tin mô tả sản phẩm sẽ được hiển thị ở đây.</p>
        </div>
      )}

      {activeTab === "additional" && (
        <div className="tab-content">
          <table>
            <tbody>
              <tr>
                <td>Color</td>
                <td>{firstItem?.color?.name || "N/A"}</td>
              </tr>
              <tr>
                <td>Size</td>
                <td>{firstItem?.size?.name || firstItem?.size || "N/A"}</td>
              </tr>
              <tr>
                <td>Quantity</td>
                <td>{firstItem?.quantity ?? "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="tab-content">
          <p>No reviews yet.</p>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
