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

function App() {
  return (
    <>
      {/* Navbar hiển thị ở mọi trang */}
      <Navbar onCartClick={() => {}} />

      {/* Các route của app */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Clothing tổng */}
        <Route path="/clothing" element={<ClothingPage />} />

        {/* Clothing theo danh mục con */}
        <Route path="/clothing/:category" element={<ClothingPage />} />

        <Route path="/swimwear" element={<Swimwear />} />

        <Route path="/accessories" element={<Accessories />} />

        <Route path="/sale" element={<Sale />} />

        {/* Trang chi tiết sản phẩm */}
        <Route path="/product/:productId" element={<ItemPage />} />

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
