import "reflect-metadata";
import { AppDataSource } from "../config/data_source";
import { Product } from "../entity/Product";
import { Category } from "../entity/Category";
import { Color } from "../entity/Color";
import { Size } from "../entity/Size";
import { ProductItem } from "../entity/ProductItem";

const seed = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected! Starting seed...");

        // Repositories
        const catRepo = AppDataSource.getRepository(Category);
        const colRepo = AppDataSource.getRepository(Color);
        const sizeRepo = AppDataSource.getRepository(Size);
        const prodRepo = AppDataSource.getRepository(Product);
        const itemRepo = AppDataSource.getRepository(ProductItem);

        // ==========================================
        // 1. TẠO MASTER DATA (Danh mục, Màu, Size)
        // ==========================================

        // Categories
        const cAoThun = await catRepo.save({ name: "Áo Thun" });
        const cSoMi = await catRepo.save({ name: "Sơ Mi" });
        const cQuan = await catRepo.save({ name: "Quần" });
        const cVay = await catRepo.save({ name: "Váy Đầm" });
        const cAoKhoac = await catRepo.save({ name: "Áo Khoác" });
        const cDoTheThao = await catRepo.save({ name: "Đồ Thể Thao" });

        // Colors
        const colorDo = await colRepo.save({ name: "Đỏ", colorCode: "#FF0000" });
        const colorXanhduong = await colRepo.save({ name: "Xanh Dương", colorCode: "#0000FF" });
        const colorXanhLa = await colRepo.save({ name: "Xanh Lá", colorCode: "#008000" });
        const colorDen = await colRepo.save({ name: "Đen", colorCode: "#000000" });
        const colorTrang = await colRepo.save({ name: "Trắng", colorCode: "#FFFFFF" });
        const colorVang = await colRepo.save({ name: "Vàng", colorCode: "#FFFF00" });
        const colorHong = await colRepo.save({ name: "Hồng", colorCode: "#FFC0CB" });
        const colorXam = await colRepo.save({ name: "Xám", colorCode: "#808080" });

        // Sizes
        const sS = await sizeRepo.save({ name: "S" });
        const sM = await sizeRepo.save({ name: "M" });
        const sL = await sizeRepo.save({ name: "L" });
        const sXL = await sizeRepo.save({ name: "XL" });

        // ==========================================
        // 2. DANH SÁCH 20 SẢN PHẨM MẪU
        // ==========================================

        const productsData = [
            // --- NHÓM CÔNG SỞ / LỊCH SỰ ---
            {
                name: "Sơ Mi Oxford Trắng Classic",
                cat: cSoMi,
                price: "450000",
                desc: "Áo sơ mi trắng vải Oxford cao cấp, chống nhăn nhẹ. Form dáng Regular Fit lịch lãm, phù hợp cho dân văn phòng, đi họp hoặc gặp gỡ đối tác. Phong cách tối giản, sang trọng.",
                variants: [{ c: colorTrang, s: [sM, sL, sXL] }]
            },
            {
                name: "Quần Tây Âu Slimfit Đen",
                cat: cQuan,
                price: "550000",
                desc: "Quần tây nam màu đen dáng slimfit hiện đại. Chất liệu vải tuyết mưa mềm mại, co giãn nhẹ. Thích hợp phối cùng áo sơ mi đi làm hoặc áo polo đi sự kiện.",
                variants: [{ c: colorDen, s: [sM, sL, sXL] }]
            },
            {
                name: "Váy Bút Chì Công Sở Thanh Lịch",
                cat: cVay,
                price: "380000",
                desc: "Chân váy bút chì dài qua gối, xẻ tà sau nhẹ nhàng. Thiết kế tôn dáng, chuyên nghiệp dành cho nữ văn phòng. Màu đen dễ phối đồ.",
                variants: [{ c: colorDen, s: [sS, sM, sL] }]
            },
            {
                name: "Áo Vest Blazer Navy",
                cat: cAoKhoac,
                price: "850000",
                desc: "Áo khoác Blazer màu xanh navy trẻ trung. Chất liệu Kaki đứng form. Phù hợp khoác ngoài đi làm, đi tiệc nhẹ hoặc hẹn hò, mang lại vẻ ngoài chỉn chu nhưng không quá cứng nhắc.",
                variants: [{ c: colorXanhduong, s: [sM, sL] }]
            },

            // --- NHÓM ĐI TIỆC / SANG TRỌNG ---
            {
                name: "Đầm Dạ Hội Đỏ Rượu Vang",
                cat: cVay,
                price: "1200000",
                desc: "Chiếc đầm đỏ quyến rũ làm từ chất liệu nhung the. Thiết kế cổ V xẻ sâu, ôm sát cơ thể khoe đường cong. Lựa chọn hoàn hảo cho các buổi tiệc tối sang trọng, đám cưới.",
                variants: [{ c: colorDo, s: [sS, sM] }]
            },
            {
                name: "Sơ Mi Lụa Satin Bóng",
                cat: cSoMi,
                price: "600000",
                desc: "Áo sơ mi chất liệu lụa Satin bóng bẩy, mềm mại. Màu đen huyền bí, tạo cảm giác sang trọng, quý phái. Phù hợp cho các buổi tiệc đêm.",
                variants: [{ c: colorDen, s: [sM, sL] }]
            },
            {
                name: "Váy Maxi Voan Hoa Đi Biển",
                cat: cVay,
                price: "420000",
                desc: "Váy Maxi dài chất voan tơ nhẹ nhàng, họa tiết hoa nhí. Thích hợp cho những chuyến du lịch biển, chụp ảnh sống ảo hoặc dạo phố mùa hè. Cảm giác bay bổng, nữ tính.",
                variants: [{ c: colorVang, s: [sS, sM] }, { c: colorHong, s: [sS, sM] }]
            },

            // --- NHÓM THỂ THAO / NĂNG ĐỘNG ---
            {
                name: "Áo Thun Thể Thao Dry-Ex",
                cat: cDoTheThao,
                price: "250000",
                desc: "Áo thun thể thao công nghệ Dry-Ex thấm hút mồ hôi siêu tốc. Chất vải mát lạnh, co giãn 4 chiều. Chuyên dụng cho chạy bộ, tập gym, đá bóng.",
                variants: [{ c: colorXanhduong, s: [sM, sL, sXL] }, { c: colorXam, s: [sM, sL, sXL] }]
            },
            {
                name: "Quần Jogger Thun Tập Gym",
                cat: cQuan,
                price: "320000",
                desc: "Quần Jogger bo gấu, chất nỉ da cá dày dặn nhưng thoáng khí. Phong cách Sporty năng động. Mặc đi tập hay mặc ở nhà đều thoải mái.",
                variants: [{ c: colorXam, s: [sM, sL] }, { c: colorDen, s: [sM, sL] }]
            },
            {
                name: "Áo Khoác Gió Chống Nước",
                cat: cAoKhoac,
                price: "490000",
                desc: "Áo khoác gió 2 lớp, lớp ngoài trượt nước, chống thấm nhẹ. Thích hợp chạy bộ buổi sáng sớm hoặc khoác nhẹ khi trời se lạnh, trời mưa phùn.",
                variants: [{ c: colorXanhLa, s: [sL, sXL] }]
            },

            // --- NHÓM CASUAL / DẠO PHỐ ---
            {
                name: "Áo Thun Cotton In Hình Graphic",
                cat: cAoThun,
                price: "180000",
                desc: "Áo thun form rộng (Oversize) in hình họa tiết đường phố. Chất Cotton 100% dày dặn. Phong cách Streetwear bụi bặm, cá tính dành cho giới trẻ.",
                variants: [{ c: colorDen, s: [sM, sL] }, { c: colorTrang, s: [sM, sL] }]
            },
            {
                name: "Quần Jean Rách Gối",
                cat: cQuan,
                price: "450000",
                desc: "Quần Jean xanh wax bạc, wash rách ở gối tạo điểm nhấn. Chất bò denim bền bỉ. Item không thể thiếu cho những buổi đi chơi, cafe cùng bạn bè.",
                variants: [{ c: colorXanhduong, s: [sM, sL, sXL] }]
            },
            {
                name: "Áo Polo Pique Cơ Bản",
                cat: cAoThun,
                price: "290000",
                desc: "Áo Polo vải mắt chim (Pique) cổ điển. Thiết kế đơn giản, lịch sự nhưng vẫn trẻ trung. Dễ dàng phối với quần Short hoặc quần Jean.",
                variants: [{ c: colorVang, s: [sM, sL] }, { c: colorDo, s: [sM, sL] }]
            },
            {
                name: "Chân Váy Ngắn Xếp Ly Tennis",
                cat: cVay,
                price: "220000",
                desc: "Chân váy ngắn xếp ly phong cách Tennis năng động, hack dáng chân dài. Phù hợp cho các bạn nữ trẻ trung, năng động, đi học hoặc đi chơi.",
                variants: [{ c: colorTrang, s: [sS, sM] }, { c: colorDen, s: [sS, sM] }]
            },

            // --- NHÓM MÙA ĐÔNG / ẤM ÁP ---
            {
                name: "Áo Len Cổ Lọ Hàn Quốc",
                cat: cAoThun, // Hoặc category Áo Len nếu có
                price: "350000",
                desc: "Áo len cổ lọ dày dặn, giữ ấm cực tốt cho ngày đại hàn. Phong cách Hàn Quốc nhẹ nhàng, ấm áp. Màu sắc pastel ngọt ngào.",
                variants: [{ c: colorHong, s: [sS, sM] }, { c: colorTrang, s: [sS, sM] }]
            },
            {
                name: "Áo Phao Lông Vũ Siêu Nhẹ",
                cat: cAoKhoac,
                price: "950000",
                desc: "Áo phao lõi lông vũ tự nhiên, siêu nhẹ nhưng giữ nhiệt cực tốt. Có thể gấp gọn vào túi. Chống chịu được thời tiết rét đậm rét hại.",
                variants: [{ c: colorDen, s: [sM, sL, sXL] }]
            },
            {
                name: "Áo Hoodie Nỉ Bông",
                cat: cAoKhoac,
                price: "320000",
                desc: "Áo Hoodie có mũ, lót nỉ bông ấm áp bên trong. Form rộng thoải mái. Item basic cho mùa thu đông.",
                variants: [{ c: colorXam, s: [sM, sL] }]
            },

            // --- PHỤ KIỆN / KHÁC ---
            {
                name: "Quần Short Kaki Mùa Hè",
                cat: cQuan,
                price: "200000",
                desc: "Quần Short ngắn ngang gối chất Kaki mát mẻ. Thiết kế lưng chun thoải mái vận động. Lựa chọn số 1 cho mùa hè nóng nực.",
                variants: [{ c: colorVang, s: [sM, sL] }, { c: colorXanhLa, s: [sM, sL] }]
            },
            {
                name: "Áo Sơ Mi Caro Flannel",
                cat: cSoMi,
                price: "300000",
                desc: "Sơ mi họa tiết kẻ caro (Flannel) bụi bặm. Có thể mặc khoác ngoài áo thun. Phong cách vintage, retro.",
                variants: [{ c: colorDo, s: [sL, sXL] }] // Caro đỏ đen
            },
            {
                name: "Áo Thun Ba Lỗ Tanktop",
                cat: cAoThun,
                price: "120000",
                desc: "Áo ba lỗ cotton sát nách. Mát mẻ, khoe cơ bắp. Thích hợp mặc ở nhà, đi tập gym hoặc mặc lót bên trong.",
                variants: [{ c: colorTrang, s: [sM, sL] }, { c: colorDen, s: [sM, sL] }]
            }
        ];

        // ==========================================
        // 3. LƯU DỮ LIỆU VÀO DB
        // ==========================================

        console.log("Saving products...");

        for (const pData of productsData) {
            // Tạo Product
            const product = await prodRepo.save({
                name: pData.name,
                description: pData.desc,
                price: pData.price,
                stockQuantity: Math.floor(Math.random() * 100) + 10, // Random tồn kho
                category: pData.cat,
                createdAt: new Date(),
            });

            // Tạo các biến thể (Item) cho Product này
            for (const variant of pData.variants) {
                // Mỗi size trong danh sách size
                for (const size of variant.s) {
                    await itemRepo.save({
                        product: product,
                        color: variant.c,
                        size: size
                    });
                }
            }
            console.log(`-> Created: ${pData.name}`);
        }

        console.log("=================================");
        console.log("SEEDING COMPLETED SUCCESSFULLY!");
        console.log("Next step: Run 'npm run embed' to generate vectors for these products.");
        console.log("=================================");

        process.exit();

    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seed();