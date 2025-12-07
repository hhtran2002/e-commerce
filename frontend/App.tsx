import { Routes, Route } from "react-router-dom";
import Home from "./src/pages/Home";
import Swimwear from "./src/pages/Swimwear";
import Navbar from "./src/component/Navbar";
import Accessories from "./src/pages/Accessories";
import Sale from "./src/pages/Sale";
import ClothingPage from "./src/pages/Clothing";
import ItemPage from "./src/pages/ItemPage";
import OrderManagement from "./src/component/OrderAdmin";
import UserManagement from "./src/component/UserAdmin";
import ProductManagement from "./src/component/ProductAdmin";
import AdminDashboard from "./src/component/Dashboard";
import Admin from "./src/pages/Admin";
import ForgotPassword from "./src/component/ForgotPassword";
import ResetPassword from "./src/component/ResetPassword";
import LoginSection from "./src/pages/Login";
import RegisterSection from "./src/pages/Register";
import ShoppingCart from "./src/pages/ShoppingCart";
import Checkout from "./src/page/Checkout";

function App() {
  return (
    <>
      {/* Navbar hiển thị ở mọi trang */}
      <Navbar onCartClick={() => {}} />

      {/* Các route của app */}
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<LoginSection />} />
        <Route path="/register" element={<RegisterSection />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Clothing tổng + theo category */}
        <Route path="/clothing" element={<ClothingPage />} />
        <Route path="/clothing/:category" element={<ClothingPage />} />

        {/* Các trang khác */}
        <Route path="/swimwear" element={<Swimwear />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/sale" element={<Sale />} />

        {/* Trang chi tiết sản phẩm */}
        <Route path="/product/:productId" element={<ItemPage />} />

        {/* Trang giỏ hàng + checkout */}
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />

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
