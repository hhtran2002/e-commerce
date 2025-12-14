// File này được xây dựng để chạy một lần duy nhất nhằm tạo
// embedding cho các sản phẩm hiện có trong database.
// Nó sẽ được khởi chạy sau khi đã sinh data cho bảng products.
// Chạy lệnh: ts-node src/scripts/embed.ts
// Mục đích: Tạo embedding cho các sản phẩm hiện có và lưu vào database
// Hỗ trợ việc tìm kiếm sản phẩm bằng vector embedding

import "reflect-metadata";
import { AppDataSource } from "../config/data_source";
import { Product } from "../entity/Product";
import { GoogleGenerativeAI } from "@google/generative-ai";

// todo: chỉnh sửa lại khóa API được lưu trong .env
const genAI = new GoogleGenerativeAI("AIzaSyBtTKNs4ExmLN0M0jjx_JMXuD-IrU7SeqI");
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

const embedData = async () => {
    // Kết nối database
    await AppDataSource.initialize();
    // Lấy repository Product
    const repo = AppDataSource.getRepository(Product);
    // Lấy tất cả sản phẩm
    const products = await repo.find();

    console.log("Starting Embedding Generation for Products...");
    for (const p of products) {
        try {
            // Tạo embedding từ tên và mô tả sản phẩm
            const text = `${p.name}. ${p.description || ""}`;
            const result = await model.embedContent(text);

            p.embedding = result.embedding.values;
            await repo.save(p);
            console.log(`Embedded Product ID ${p.id}: ${p.name}`);
        }
        catch (e) {
            console.error(e);
        }
    }
    process.exit(0);
};

embedData();