import { useEffect, useState } from "react";
import { User, UserInput } from "../type/User";
import UserForm from "../component/UserForm";
import UserTable from "../component/UserTable";
import "../style/UserAdmin.css";
// import Pagination from '../components/Pagination';
import { FaArrowLeft } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / limit);

  const loadUsers = () => {
    fetch(`http://localhost:3000/api/users?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data || []);
        setTotalCount(data.totalCount || 0);
      })
      .catch((err) => console.error("Error loading users:", err));
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/users?page=${page}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = data?.data;
        if (Array.isArray(arr)) {
          setUsers(arr);
          setTotalCount(data.totalCount || arr.length);
        } else {
          console.error("⚠️ Invalid user list:", data);
        }
      })
      .catch((err) => console.error("Error loading users:", err));
  }, [page]);

  // const handleAdd = () => {
  //   setEditingUser(null);
  //   setShowForm(true);
  // };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
        credentials: "include",
        redirect: "manual",
      })
        .then((res) => {
          if (res.ok) loadUsers();
          else console.error("Failed to delete user");
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  const handleFormSubmit = (user: UserInput | User) => {
    if ("id" in user) {
      fetch(`http://localhost:3000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then(() => {
          loadUsers();
          setShowForm(false);
        })
        .catch((err) => console.error("Error updating user:", err));
    } else {
      fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Creation failed");
          return res.json();
        })
        .then(() => {
          loadUsers();
          setShowForm(false);
        })
        .catch((err) => {
          console.error("Error adding user:", err);
          alert("Email already exists or data is invalid!");
        });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const start = (page - 1) * limit;
  const currentUsers = users.slice(start, start + limit);

  return (
    <div className="user-management-container">
      <h2 className="user-management-title">User Management</h2>

      {showForm ? (
        <>
          <button onClick={handleCancel} className="back-button">
            <FaArrowLeft /> Back
          </button>

          <UserForm
            initialData={editingUser || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </>
      ) : (
        <>
          <UserTable
            users={currentUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

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
        </>
      )}
    </div>
  );
};

export default UserManagement;
