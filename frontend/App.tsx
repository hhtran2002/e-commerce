import { Routes, Route } from "react-router-dom";
import Home from "../frontend/src/page/Home";
import Clothing from "../frontend/src/page/Clothing";
import Swimwear from "../frontend/src/page/Swimwear";
import Navbar from "./src/component/Navbar";
import Accessories from "./src/page/Accessories";
import Sale from "./src/page/Sale";
function App() {
  return (
    <>
      {/* Navbar hiển thị ở mọi trang */}
      <Navbar onCartClick={() => {}} />

      {/* Các route của app */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/clothing" element={<Clothing />} />

        <Route path="/swimwear" element={<Swimwear />} />

        <Route path="/accessories" element={<Accessories />} />

        <Route path="/sale" element={<Sale />} />

      </Routes>
    </>
  );
}

export default App;
