import React from 'react';
import '../style/UserTable.css';
import { User } from '../type/User';

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
};

const UserTable: React.FC<Props> = ({ users, onEdit, onDelete }) => {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
            <th>Phone</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
              <td>{user.phone}</td>
            <td>
              {/*<button onClick={() => onEdit(user)} className="btn-edit">Edit</button>*/}
              <button onClick={() => onDelete(user.id)} className="btn-delete">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;