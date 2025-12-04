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

function App() {
  return (
    <>
      {/* Navbar hiển thị ở mọi trang */}
      <Navbar onCartClick={() => {}} />

      {/* Các route của app */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Route sử dụng cho đăng nhập và đăng ký */}
        {/* --- THÊM 2 DÒNG NÀY --- */}
        <Route path="/login" element={<LoginSection />} />
        <Route path="/register" element={<RegisterSection />} />
        {/* ----------------------- */}

        {/* Clothing tổng */}
        <Route path="/clothing" element={<ClothingPage />} />

        {/* Clothing theo danh mục con */}
        <Route path="/clothing/:category" element={<ClothingPage />} />

        <Route path="/swimwear" element={<Swimwear />} />

        <Route path="/accessories" element={<Accessories />} />

        <Route path="/sale" element={<Sale />} />

        {/* Trang chi tiết sản phẩm */}
        <Route path="/product/:productId" element={<ItemPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ==== SITE ADMIN ==== */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          {/* admin-only nested routes above; site-level password routes moved out */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
