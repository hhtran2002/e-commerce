import React, { useEffect, useState } from "react";
import { ProductType } from "../type/Product";
import "../style/ProductAdmin.css";

// Type cho Category
type CategoryType = {
  id: number;
  name: string;
};

// Dữ liệu cho form
type ProductFormData = {
  name: string;
  price: string;
  stockQuantity: string;
  categoryId: number;
  description: string;
  images: string[]; // danh sách URL ảnh (Cloudinary)
};

const emptyForm: ProductFormData = {
  name: "",
  price: "",
  stockQuantity: "",
  categoryId: 0,
  description: "",
  images: [],
};

const ProductAdmin: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [uploading, setUploading] = useState(false);

  // ============ LOAD DATA ============
  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadProducts(), loadCategories()]);
      setLoading(false);
    })();
  }, []);

  // ============ FORM HANDLER ============

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({
      ...emptyForm,
      categoryId: categories[0]?.id || 0,
    });
    setShowForm(true);
  };

  const openEditForm = (p: ProductType) => {
    const firstItem = p.items?.[0];
    setEditingProduct(p);
    setFormData({
      name: p.name,
      price: String(p.price ?? ""),
      stockQuantity: String(p.stockQuantity ?? ""),
      categoryId: p.category?.id ?? 0,
      description: p.description ?? "",
      // lấy ảnh từ item đầu tiên (nếu có)
      images: firstItem?.images?.map((img) => img.imageUrl) || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xác nhận xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Xóa thất bại!");
        return;
      }
      await loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "categoryId" ? Number(value) : value,
    }));
  };

  // ----------- UPLOAD ẢNH LÊN BACKEND / CLOUDINARY -----------
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);

        const res = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: fd,
        });

        if (!res.ok) {
          console.error("Upload failed for", file.name);
          continue;
        }

        const data = await res.json(); // { url: 'https://res.cloudinary...' }
        if (data.url) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }));
        }
      }
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      alert("Upload ảnh thất bại");
    } finally {
      setUploading(false);
      // reset input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!formData.price) {
      alert("Vui lòng nhập giá");
      return;
    }
    if (!formData.stockQuantity) {
      alert("Vui lòng nhập số lượng tồn");
      return;
    }
    if (!formData.categoryId) {
      alert("Vui lòng chọn danh mục");
      return;
    }

    const body = {
      name: formData.name.trim(),
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      categoryId: formData.categoryId,
      description: formData.description.trim() || undefined,
      images: formData.images, // gửi list URL ảnh cho backend
    };

    try {
      if (editingProduct) {
        // UPDATE
        const res = await fetch(
          `http://localhost:3000/api/products/${editingProduct.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        if (!res.ok) {
          alert("Cập nhật sản phẩm thất bại");
          return;
        }
      } else {
        // CREATE
        const res = await fetch("http://localhost:3000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          alert("Thêm sản phẩm thất bại");
          return;
        }
      }

      await loadProducts();
      setShowForm(false);
      setEditingProduct(null);
      setFormData(emptyForm);
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  // ============ RENDER ============

  if (loading) return <p>Loading...</p>;

  return (
    <div className="product-table-container">
      <h2>Product Management</h2>

      {!showForm && (
        <div style={{ textAlign: "right", marginBottom: 12 }}>
          <button className="btn-add" onClick={openAddForm}>
            + Add product
          </button>
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>

            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </label>

            <label>
              Price:
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleFormChange}
              />
            </label>

            <label>
              Stock quantity:
              <input
                type="number"
                name="stockQuantity"
                min="0"
                step="1"
                value={formData.stockQuantity}
                onChange={handleFormChange}
              />
            </label>

            <label>
              Category:
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleFormChange}
              >
                <option value={0}>-- Select category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            {/* 🔥 PHẦN ẢNH */}
            <label>
              Images:
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </label>
            {uploading && <p>Uploading images...</p>}

            {formData.images.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {formData.images.map((url, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      width: 80,
                      height: 80,
                      borderRadius: 6,
                      overflow: "hidden",
                      border: "1px solid #ddd",
                    }}
                  >
                    <img
                      src={url}
                      alt={`img-${idx}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "none",
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 12,
                        lineHeight: "20px",
                        textAlign: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label>
              Description:
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleFormChange}
              />
            </label>

            <div className="modal-buttons">
              <button className="btn-save" onClick={handleSubmit}>
                Save
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Base Price</th>
            <th>Stock</th>
            <th>Items</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No products
              </td>
            </tr>
          ) : (
            products.map((p) => {
              const firstItem = p.items?.[0];
              const img = firstItem?.images?.[0]?.imageUrl || "/fallback.jpg";

              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <img
                      src={img}
                      alt={p.name}
                      width={60}
                      style={{ borderRadius: 6 }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category?.name}</td>
                  <td>{Number(p.price).toLocaleString()}₫</td>
                  <td>{p.stockQuantity}</td>
                  <td>{p.items?.length || 0}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openEditForm(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      style={{ marginLeft: 8 }}
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductAdmin;
