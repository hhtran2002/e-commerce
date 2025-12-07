import { Routes, Route } from "react-router-dom";
import Home from "../frontend/src/page/Home";
import Swimwear from "../frontend/src/page/Swimwear";
import Navbar from "./src/component/Navbar";
import Accessories from "./src/page/Accessories";
import Sale from "./src/page/Sale";
import ClothingPage from "../frontend/src/page/Clothing";
import ItemPage from "./src/page/ItemPage";
import OrderManagement from "./src/component/OrderAdmin";
import UserManagement from "./src/component/UserAdmin";
import ProductManagement from "./src/component/ProductAdmin";
import AdminDashboard from "./src/component/Dashboard";
import Admin from "./src/page/Admin";

import ShoppingCart from "./src/page/ShoppingCart";
import CheckoutPage from "./src/page/Checkout"; // nếu bạn đặt tên khác thì sửa lại

function App() {
  return (
    <>
      <Navbar onCartClick={() => {}} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clothing" element={<ClothingPage />} />
        <Route path="/clothing/:category" element={<ClothingPage />} />
        <Route path="/swimwear" element={<Swimwear />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/product/:productId" element={<ItemPage />} />

        {/* Trang giỏ hàng + checkout */}
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* ==== SITE ADMIN ==== */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
