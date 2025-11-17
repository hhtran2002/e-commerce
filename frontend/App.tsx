import { Routes, Route } from "react-router-dom";
import Home from '../frontend/src/page/Home';
import Navbar from "./src/component/Navbar";
function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      {/* <Route path="/*" element={<Navbar />} /> */}
    </Routes>
  
  );
}

export default App;
