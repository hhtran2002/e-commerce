// frontend/src/component/UserTable.tsx
import React from 'react';
import '../style/UserTable.css';
import { User } from '../type/User';

type Props = {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (userId: number) => void;
};

const UserTable: React.FC<Props> = ({ users, onEdit, onDelete }) => {
  // Hàm điều chỉnh hiển thị ngày giờ (VD: 2025-12-07 -> 07/12/2025)
  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "N/A";
    return new Date(dateTimeStr).toLocaleString(
      "vi-VN", { day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit" }
    );
  };

  // Hiển thị bảng người dùng
  return (
    <div className="table-responsive">
      <table className="user-table">
        <thead style={{ backgroundColor: 'black', color: 'white' }}>
          <tr>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Ngày tạo</th>
            {/* <th>Hành động</th> */} 
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.fullName || user.username}</td>
                <td>{user.email}</td>
                <td>{formatDateTime(user.createdAt)}</td>
                
                {/* Tạm ẩn nút sửa/xóa vì yêu cầu chỉ là Xem Danh Sách 
                <td>
                  <button onClick={() => onEdit && onEdit(user)} className="btn-icon edit">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete && onDelete(user.id)} className="btn-icon delete">
                    <FaTrash />
                  </button>
                </td> 
                */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                Không có dữ liệu người dùng.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;