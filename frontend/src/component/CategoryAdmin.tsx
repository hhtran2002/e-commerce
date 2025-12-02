import React, { JSX, useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  all_rate: number;
  category_id: number;
};

type Category = {
  id: number;
  name: string;
  products: Product[];
  parent?: { id: number; name: string } | null;
  children?: Category[];
};

// ==== COMPONENT ====
const CategoryAdmin: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [newName, setNewName] = useState("");
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        setFlatCategories(data);
        setCategories(buildTree(data));
      });
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setExpandedIds([]);
      setSearching(false);
      return;
    }

    const matchedIds: number[] = [];

    const findMatches = (cats: Category[]) => {
      cats.forEach((cat) => {
        const match = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (match) {
          let parent = cat.parent;
          while (parent) {
            matchedIds.push(parent.id);
            parent = flatCategories.find((c) => c.id === parent?.id)?.parent || null;
          }
        }
        if (cat.children?.length) {
          findMatches(cat.children);
        }
      });
    };

    findMatches(categories);
    setExpandedIds([...new Set(matchedIds)]);
    setSearching(true);
  }, [searchTerm]);

  const buildTree = (flatList: Category[]): Category[] => {
    const idMap: { [key: number]: Category & { children: Category[] } } = {};
    const roots: Category[] = [];

    flatList.forEach((cat) => {
      idMap[cat.id] = { ...cat, children: [] };
    });

    flatList.forEach((cat) => {
      const parentId = cat.parent?.id ?? null;
      if (parentId) {
        idMap[parentId].children.push(idMap[cat.id]);
      } else {
        roots.push(idMap[cat.id]);
      }
    });

    return roots;
  };

  const handleToggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (!newName.trim()) {
      alert("Vui lòng nhập tên");
      return;
    }
    fetch("http://localhost:3000/api/categories/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, parent_id: selectedParent }),
    }).then(() => window.location.reload());
  };

  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = () => {
    fetch(`http://localhost:3000/api/categories/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" , 'Authorization': 'Bearer ' + sessionStorage.getItem('token') || ''},
      body: JSON.stringify({ name: editingName }),
    }).then(() => window.location.reload());
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn xoá?")) {
      fetch(`http://localhost:3000/api/categories/${id}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" , 'Authorization': 'Bearer ' + sessionStorage.getItem('token') || ''},
      }).then(() => window.location.reload());
    }
  };

  const renderFlatList = (list: Category[], level = 0): JSX.Element[] => {
  let items: JSX.Element[] = [];

  list.forEach((cat) => {
    const match = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const hasMatchingChildren =
      cat.children?.some((child) =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (searchTerm && !match && !hasMatchingChildren) return;

    items.push(
      <div
        key={cat.id}
        className="category-row"
        style={{ paddingLeft: `${level * 20}px` }}  // chừa lại cái này vì phụ thuộc level
      >
        {cat.children && cat.children.length > 0 ? (
          <span
            className="category-toggle"
            onClick={() => handleToggleExpand(cat.id)}
          >
            {expandedIds.includes(cat.id) ? "▼" : "▶"}
          </span>
        ) : (
          <span className="category-toggle-placeholder"></span>
        )}

        {editingId === cat.id ? (
          <>
            <input
              className="category-edit-input"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
            />
            <button className="category-btn category-btn--save" onClick={handleUpdate}>
              💾
            </button>
            <button
              className="category-btn category-btn--cancel"
              onClick={() => setEditingId(null)}
            >
              ❌
            </button>
          </>
        ) : (
          <>
            <span className="category-name">
              {searchTerm ? (
                <>
                  {cat.name
                    .split(new RegExp(`(${searchTerm})`, "gi"))
                    .map((part, idx) =>
                      part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <mark key={idx}>{part}</mark>
                      ) : (
                        <span key={idx}>{part}</span>
                      )
                    )}
                </>
              ) : (
                cat.name
              )}
            </span>
            <button
              className="category-btn category-btn--edit"
              onClick={() => handleEdit(cat.id, cat.name)}
            >
              ✏️ Sửa
            </button>
            <button
              className="category-btn category-btn--delete"
              onClick={() => handleDelete(cat.id)}
            >
              🗑️ Xoá
            </button>
          </>
        )}
      </div>
    );

    if (expandedIds.includes(cat.id) && cat.children?.length) {
      items = items.concat(renderFlatList(cat.children, level + 1));
    }
  });

  return items;
};

return (
  <div className="category-admin">
    <h2 className="category-admin__title">🗂️ Quản lý danh mục</h2>

    <div className="category-admin__controls">
      <input
        type="text"
        placeholder="Tên danh mục"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="category-input"
      />

      <select
        value={selectedParent ?? ""}
        onChange={(e) =>
          setSelectedParent(e.target.value ? parseInt(e.target.value) : null)
        }
        className="category-select"
      >
        <option value="">Không có danh mục cha</option>
        {flatCategories
          .filter((cat) => cat.parent == null)
          .map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
      </select>

      <input
        type="text"
        placeholder="Tìm kiếm danh mục..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="category-input"
      />

      <button className="category-btn category-btn--add" onClick={handleAdd}>
        ➕ Thêm
      </button>
    </div>

    <div className="category-list">
      {renderFlatList(categories)}
    </div>
  </div>
);

};

export default CategoryAdmin;