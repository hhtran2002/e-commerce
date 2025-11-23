import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar2.css";

const Sidebar2 = () => {
  function handleLogout(event: React.MouseEvent<HTMLLIElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="sidebar2">
      <ul>
        <li>
          <Link to="/myaccount/orders">Orders</Link>
        </li>
        {/*<li>*/}
        {/*  <Link to="/myaccount/address">Addresses</Link>*/}
        {/*</li>*/}
        <li>
          <Link to="/myaccount/details">Account details</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar2;