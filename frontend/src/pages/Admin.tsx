// import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../style/Admin.css';

const Admin = () => {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="logo">ADMIN</div>
        <ul className="menu">
          <li><Link to="/admin">Dashboard</Link></li> 
          <li><Link to="/admin/users">User</Link></li>
          <li><Link to="/admin/products">Product</Link></li>
          {/*<li><Link to="/admin/categories">Category</Link></li>*/}
          <li><Link to="/admin/orders">Order</Link></li>
        </ul>
      </aside>

      <div className="main">
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;