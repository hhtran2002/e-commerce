import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Slide from "../component/Slide";
import NewArrivals, { Product } from "../component/NewArrivals";
import Categories from "../component/Categories";

const mockProducts: Product[] = [
  { id: 1, name: "Charli Poplin Set", price: 335, imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/CHARLI6.webp", isNew: true },
  { id: 2, name: "Clare Knit Set",   price: 465, imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/reye-knit-dress1.webp", isNew: true },
  { id: 3, name: "Erika Knit Top",   price: 245, imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/ERIKA6.webp", isNew: true },
  { id: 4, name: "GILL SET",         price: 525, imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/GILL-SET.webp", isNew: true },
  { id: 5, name: "Reye Knit Maxi",   price: 325, imageUrl: "https://stitched-lb.com/wp-content/uploads/2025/09/reye-knit-dress3.webp", isNew: true },
];

export default function Home() {
    return (
        <>

            {/* Nội dung trang Home */}
            <div style={{ minHeight: "80vh" }}>
                <Slide />
            </div>

             {/* <NewArrivals products={mockProducts} />

             <Categories /> */}

            <Footer />
        </>
    );
}
