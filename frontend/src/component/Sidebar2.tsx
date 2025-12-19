import React from "react";
import { Link } from "react-router-dom";

const Sidebar2 = () => {
  return (
    <div className="sidebar2">
      <ul>
        <li>
          <Link to="/myaccount/orders">Orders</Link>
        </li>

        <li>
          {/* Trang này sẽ hiển thị Address + Account Details (2 cột) */}
          <Link to="/myaccount/dashboard">Account details</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar2;
