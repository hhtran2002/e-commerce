import React, { useEffect, useState } from "react";
import "../style/ProductAdmin.css";
import Pagination from "../component/Pagination";

type ProductItem = {
  id: number;
  price: number;
  new_price: number | null;
  quantity: number;
  images: { image_url: string }[];
};

type ProductPromotion = {
  promotion: {
    discount_rate: number;
    start_at: string;
    end_at: string;
  };
};

type Product = {
  id: number;
  name: string;
  description: string;
  category_id: number;
  productItems: ProductItem[];
  productPromotions?: ProductPromotion[];
};

type Category = {
  id: number;
  name: string;
  parent_id: number | null;
};

type FormDataType = {
  name: string;
  price: string | number;
  quantity: string | number;
  images: string[];
  category_id: number;
  description: string;
  discount: number;
};

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    price: "",
    quantity: "",
    images: [],
    category_id: 0,
    description: "",
    discount: 0,
  });

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / limit);
  const [fetchAll, setFetchAll] = useState(true);

  const loadProducts = () => {
    const url = fetchAll
      ? "http://localhost:3000/api/products"
      : `http://localhost:3000/api/products?page=${page}&limit=${limit}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (fetchAll) {
          setProducts(data.data);
          setTotalCount(data.data.length);
        } else {
          setProducts(data.data);
          setTotalCount(data.totalCount);
        }
      })
      .catch((err) => console.error("Lỗi khi tải sản phẩm:", err));
  };

  useEffect(() => {
    loadProducts();
  }, [page, fetchAll]);

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi tải danh mục:", err));
  }, []);

  const getCategoryName = (categoryId: number): string => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Không rõ";
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Xác nhận xoá sản phẩm này?")) {
      fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.ok) loadProducts();
        })
        .catch((err) => console.error("Lỗi xoá sản phẩm:", err));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      price: product.productItems?.[0]?.price ?? "",
      quantity: product.productItems?.[0]?.quantity ?? "",
      images:
        product.productItems?.[0]?.images?.map((img) => img.image_url) || [],
      category_id: product.category_id,
      description: product.description || "",
      discount: product.productPromotions?.[0]?.promotion?.discount_rate
        ? Math.round(product.productPromotions[0].promotion.discount_rate * 100)
        : 0,
    });
    setShowForm(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange =
    (name: "price" | "quantity" | "discount") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Math.max(0, parseFloat(value)),
      }));
    };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append("image", file);

          const res = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: formDataUpload,
          });

          const data = await res.json();

          // Chỉ lưu đường dẫn server trả về
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }));
        } catch (err) {
          console.error("Lỗi khi upload ảnh:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async () => {
    try {
      if (
        !formData.price ||
        !formData.quantity ||
        formData.images.length === 0
      ) {
        alert("Vui lòng nhập giá, số lượng và ít nhất 1 hình ảnh.");
        return;
      }

      if (editingProduct) {
        // Update existing product
        await fetch(`http://localhost:3000/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            category_id: formData.category_id,
          }),
        });

        const productItemId = editingProduct.productItems?.[0]?.id;

        if (productItemId) {
          await fetch(
            `http://localhost:3000/api/product-items/${productItemId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",

                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                price: formData.price,
                quantity: formData.quantity,
                product_id: editingProduct.id,
                images: formData.images.map((url) => ({ image_url: url })),
              }),
            }
          );
        }

        // Luôn gọi API set discount, kể cả khi discount = 0
        await fetch(
          "http://localhost:3000/api/product-promotions/set-discount",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              product_id: editingProduct.id,
              discount_rate: formData.discount / 100,
            }),
          }
        );
      } else {
        // Create new product
        const res = await fetch("http://localhost:3000/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            category_id: formData.category_id,
          }),
        });

        const newProduct = await res.json();

        await fetch(`http://localhost:3000/api/product-items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            price: formData.price,
            quantity: formData.quantity,
            product_id: newProduct.id,
            images: formData.images.map((url) => ({ image_url: url })),
          }),
        });

        if (formData.discount > 0) {
          await fetch(
            "http://localhost:3000/api/product-promotions/set-discount",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                product_id: newProduct.id,
                discount_rate: formData.discount / 100,
              }),
            }
          );
        }
      }

      loadProducts();
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        quantity: "",
        images: [],
        category_id: 0,
        description: "",
        discount: 0,
      });
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
      alert("Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.");
    }
  };

  const start = (page - 1) * limit;
  const currentProducts = products.slice(start, start + limit);

  return (
    <div className="product-table-container">
      {showForm ? (
        <div className="form-popup">
          <h3>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>

          <label>
            Product name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleNumberChange("price")}
            />
          </label>

          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleNumberChange("quantity")}
            />
          </label>

          <label>
            Discount(%):
            <input
              type="number"
              name="discount"
              value={formData.discount}
              min={0}
              max={100}
              step={1}
              onChange={handleNumberChange("discount")}
            />
          </label>

          <label>
            Add images:
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </label>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {formData.images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative" as const,
                  margin: "4px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  width: "100px",
                  height: "100px",
                }}
              >
                <img
                  src={img}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== idx),
                    }));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <label>
            Description:
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              style={{
                resize: "none",
                overflow: "auto",
                height: "150px",
                width: "100%",
              }}
            />
          </label>
          <label>
            Category:
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category_id: Number(e.target.value),
                })
              }
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <button className="btn-edit" onClick={handleFormSubmit}>
              Save
            </button>
            <button className="btn-delete" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16, textAlign: "center" }}>
            <input
              type="text"
              placeholder=" Tìm kiếm sản phẩm theo tên..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset về trang đầu khi tìm
              }}
              style={{
                padding: "8px 12px",
                width: "300px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Category</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p, index) => {
                const originalPrice = p.productItems?.[0]?.price ?? 0;
                const now = new Date();
                const validPromotion = p.productPromotions?.find(
                  (pp) =>
                    pp.promotion &&
                    pp.promotion.start_at &&
                    pp.promotion.end_at &&
                    new Date(pp.promotion.start_at) <= now &&
                    new Date(pp.promotion.end_at) >= now
                );
                const discountRate =
                  validPromotion?.promotion?.discount_rate ?? 0;
                const newPrice =
                  discountRate > 0
                    ? Math.round(originalPrice * (1 - discountRate))
                    : originalPrice;

                return (
                  <tr key={p.id}>
                    <td style={{ textAlign: "center" }}>{start + index + 1}</td>
                    <td>{p.name || "Không có tên"}</td>
                    <td>
                      {originalPrice ? (
                        <>
                          {discountRate > 0 ? (
                            <>
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "#999",
                                }}
                              >
                                {originalPrice.toLocaleString()}₫
                              </span>
                              <br />
                              <span
                                style={{ color: "#e44d26", fontWeight: "bold" }}
                              >
                                {newPrice.toLocaleString()}₫
                              </span>
                              <br />
                              <span style={{ color: "#e44d26" }}>
                                (-{Math.round(discountRate * 100)}%)
                              </span>
                            </>
                          ) : (
                            <span>{originalPrice.toLocaleString()}₫</span>
                          )}
                        </>
                      ) : (
                        "Không rõ"
                      )}
                    </td>
                    <td>
                      {discountRate > 0
                        ? `-${Math.round(discountRate * 100)}%`
                        : ""}
                    </td>
                    <td>{getCategoryName(p.category_id)}</td>
                    <td>
                      {p.productItems?.[0]?.images?.length ? (
                        p.productItems[0].images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img.image_url}
                            alt={p.name}
                            width={60}
                            style={{ margin: 4 }}
                          />
                        ))
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    style={{
                      margin: 4,
                      padding: "8px 12px",
                      backgroundColor: pageNumber === page ? "#333" : "#eee",
                      color: pageNumber === page ? "#fff" : "#000",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button
              className="btn-add"
              onClick={() => {
                setFormData({
                  name: "",
                  price: "",
                  quantity: "",
                  images: [],
                  category_id: categories[0]?.id || 0,
                  description: "",
                  discount: 0,
                });
                setEditingProduct(null);
                setShowForm(true);
              }}
            >
              + Add new products
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManagement;
