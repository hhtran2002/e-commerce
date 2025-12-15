// src/component/UserAdmin.tsx
import { useEffect, useState } from "react";
import { User } from "../type/User";
import userApi from "../api/userApi";
import UserTable from "../component/UserTable";
import "../style/UserAdmin.css"; 

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- Phân trang Client-side ---
  const [page, setPage] = useState(1);
  const limit = 10; 

  // Hàm gọi API lấy danh sách
  const fetchUserList = async () => {
    try {
      setLoading(true);
      // Gọi qua userApi -> axiosClient -> Tự lấy token localStorage
      const response: any = await userApi.getAll();
      
      // Backend trả về dạng: { message: "...", data: [...] }
      if (response && response.data) {
        setUsers(response.data);
      } else {
        // Trường hợp API trả về mảng trực tiếp (fallback)
        setUsers(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error("Lỗi tải user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  // Tính toán cắt trang
  const totalPages = Math.ceil(users.length / limit);
  const start = (page - 1) * limit;
  const currentUsers = users.slice(start, start + limit);

  return (
    <div className="user-management-container">
      <h2 className="user-management-title">Quản lý User (Admin)</h2>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <UserTable 
            users={currentUsers} 
            // Không truyền onEdit/onDelete vẫn chạy tốt nhờ dấu ? bên UserTable
          />

          {/* Thanh phân trang */}
          {totalPages > 1 && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  style={{
                    margin: "0 5px",
                    padding: "8px 12px",
                    backgroundColor: pageNumber === page ? "#333" : "#eee",
                    color: pageNumber === page ? "#fff" : "#000",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;